import com.sun.net.httpserver.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class PkHoldingWebsiteServer {
  static final Path ROOT=Paths.get("").toAbsolutePath().normalize(), UPLOADS=ROOT.resolve("assets/uploads"), DATA=ROOT.resolve("data/uploads.tsv");
  static final Map<String,String> ROUTES=Map.of("","index.html","home","index.html","about","about.html","showroom","showroom.html","achievements","achievements.html","media","media.html","admin","admin.html");
  static final Map<String,Session> SESSIONS=new ConcurrentHashMap<>();
  static final SecureRandom RANDOM=new SecureRandom();
  static final String USER=env("PK_ADMIN_USERNAME","pkadmin7680"), PASSWORD=env("PK_ADMIN_PASSWORD","");
  static final long SESSION_MS=12L*60*60*1000;

  public static void main(String[] args)throws IOException{
    Files.createDirectories(UPLOADS); Files.createDirectories(DATA.getParent());
    HttpServer s=HttpServer.create(new InetSocketAddress("0.0.0.0",Integer.parseInt(env("PORT","8000"))),0);
    s.createContext("/api/admin/login",PkHoldingWebsiteServer::login);
    s.createContext("/api/admin/logout",PkHoldingWebsiteServer::logout);
    s.createContext("/api/admin/session",PkHoldingWebsiteServer::sessionStatus);
    s.createContext("/api/admin/upload",PkHoldingWebsiteServer::upload);
    s.createContext("/api/uploads",PkHoldingWebsiteServer::publicUploads);
    s.createContext("/",new StaticHandler()); s.start();
    System.out.println("PK Holding website: http://localhost:"+env("PORT","8000"));
    System.out.println(PASSWORD.isEmpty()?"ADMIN LOGIN DISABLED: set PK_ADMIN_PASSWORD and restart.":"Private admin login enabled for "+USER);
  }

  static void login(HttpExchange x)throws IOException{
    if(!method(x,"POST"))return;
    if(PASSWORD.isEmpty()){json(x,503,"{\"ok\":false,\"message\":\"Owner login is not configured on this server.\"}");return;}
    Map<String,String> f=form(new String(readLimit(x.getRequestBody(),16384),StandardCharsets.UTF_8));
    if(!equal(f.get("username"),USER)||!equal(f.get("password"),PASSWORD)){json(x,401,"{\"ok\":false,\"message\":\"Incorrect username or password.\"}");return;}
    String token=random(32), csrf=random(24); SESSIONS.put(token,new Session(csrf,System.currentTimeMillis()+SESSION_MS));
    x.getResponseHeaders().add("Set-Cookie",cookie(token,x,43200));
    json(x,200,"{\"ok\":true,\"username\":\""+esc(USER)+"\",\"csrf\":\""+csrf+"\"}");
  }
  static void logout(HttpExchange x)throws IOException{
    if(!method(x,"POST"))return; Session s=authorized(x,true); if(s==null)return;
    SESSIONS.remove(cookieValue(x,"pk_admin_session")); x.getResponseHeaders().add("Set-Cookie",cookie("",x,0)); json(x,200,"{\"ok\":true}");
  }
  static void sessionStatus(HttpExchange x)throws IOException{
    if(!method(x,"GET"))return; Session s=current(x);
    if(s==null)json(x,401,"{\"authenticated\":false}"); else json(x,200,"{\"authenticated\":true,\"username\":\""+esc(USER)+"\",\"csrf\":\""+s.csrf+"\"}");
  }
  static void upload(HttpExchange x)throws IOException{
    if(!method(x,"POST"))return; if(authorized(x,true)==null)return;
    String boundary=boundary(x.getRequestHeaders().getFirst("Content-Type"));
    if(boundary==null){json(x,400,"{\"ok\":false,\"message\":\"Invalid upload request.\"}");return;}
    byte[] body;
    try{body=readLimit(x.getRequestBody(),260*1024*1024);}catch(IOException e){json(x,413,"{\"ok\":false,\"message\":\"File is too large.\"}");return;}
    Map<String,Part> p=multipart(body,boundary); String kind=text(p,"kind").toLowerCase(), brand=clean(text(p,"brand"),80), title=clean(text(p,"title"),120), desc=clean(text(p,"description"),500); Part file=p.get("file");
    if(!List.of("poster","video","brochure").contains(kind)||brand.isEmpty()||title.isEmpty()||file==null){json(x,400,"{\"ok\":false,\"message\":\"Brand, title, type and file are required.\"}");return;}
    Rule rule=validate(kind,file); if(!rule.ok){json(x,400,"{\"ok\":false,\"message\":\""+esc(rule.error)+"\"}");return;}
    String id=UUID.randomUUID().toString(), stored=id+rule.ext, url="assets/uploads/"+stored; Path out=UPLOADS.resolve(stored).normalize();
    if(!out.startsWith(UPLOADS)){json(x,400,"{\"ok\":false,\"message\":\"Invalid file.\"}");return;}
    Files.write(out,file.data,StandardOpenOption.CREATE_NEW);
    Item item=new Item(id,Instant.now().toEpochMilli(),kind,brand,title,desc,url,clean(file.filename,180));
    try{append(item);}catch(IOException e){Files.deleteIfExists(out);throw e;}
    json(x,201,"{\"ok\":true,\"item\":"+itemJson(item)+"}");
  }
  static void publicUploads(HttpExchange x)throws IOException{
    if(!method(x,"GET"))return; List<Item> list=load(); StringBuilder b=new StringBuilder("{\"items\":[");
    for(int i=0;i<list.size();i++){if(i>0)b.append(',');b.append(itemJson(list.get(i)));} json(x,200,b.append("]}").toString());
  }

  static Session authorized(HttpExchange x,boolean csrf)throws IOException{
    Session s=current(x); if(s==null){json(x,401,"{\"ok\":false,\"message\":\"Please sign in again.\"}");return null;}
    if(csrf&&!equal(x.getRequestHeaders().getFirst("X-CSRF-Token"),s.csrf)){json(x,403,"{\"ok\":false,\"message\":\"Security token expired. Please sign in again.\"}");return null;} return s;
  }
  static Session current(HttpExchange x){String t=cookieValue(x,"pk_admin_session");Session s=t==null?null:SESSIONS.get(t);if(s!=null&&s.expires<System.currentTimeMillis()){SESSIONS.remove(t);return null;}return s;}
  static String cookie(String value,HttpExchange x,int age){String c="pk_admin_session="+value+"; Path=/; HttpOnly; SameSite=Strict; Max-Age="+age;if("https".equalsIgnoreCase(x.getRequestHeaders().getFirst("X-Forwarded-Proto")))c+="; Secure";return c;}
  static String cookieValue(HttpExchange x,String name){String h=x.getRequestHeaders().getFirst("Cookie");if(h==null)return null;for(String i:h.split(";")){String[] p=i.trim().split("=",2);if(p.length==2&&p[0].equals(name))return p[1];}return null;}

  static synchronized void append(Item i)throws IOException{String line=i.id+"\t"+i.time+"\t"+enc(i.kind)+"\t"+enc(i.brand)+"\t"+enc(i.title)+"\t"+enc(i.desc)+"\t"+enc(i.url)+"\t"+enc(i.original)+System.lineSeparator();Files.writeString(DATA,line,StandardCharsets.UTF_8,StandardOpenOption.CREATE,StandardOpenOption.APPEND);}
  static synchronized List<Item> load()throws IOException{
    if(!Files.isRegularFile(DATA))return Collections.emptyList();List<Item> items=new ArrayList<>();
    for(String line:Files.readAllLines(DATA,StandardCharsets.UTF_8)){String[] v=line.split("\\t",-1);if(v.length!=8)continue;try{String url=dec(v[6]);Path f=ROOT.resolve(url).normalize();if(f.startsWith(UPLOADS)&&Files.isRegularFile(f))items.add(new Item(v[0],Long.parseLong(v[1]),dec(v[2]),dec(v[3]),dec(v[4]),dec(v[5]),url,dec(v[7])));}catch(Exception ignored){}}
    Collections.reverse(items);return items;
  }
  static String itemJson(Item i){return "{\"id\":\""+esc(i.id)+"\",\"createdAt\":"+i.time+",\"kind\":\""+esc(i.kind)+"\",\"brand\":\""+esc(i.brand)+"\",\"title\":\""+esc(i.title)+"\",\"description\":\""+esc(i.desc)+"\",\"url\":\""+esc(i.url)+"\",\"originalName\":\""+esc(i.original)+"\"}";}

  static Rule validate(String kind,Part f){String n=f.filename.toLowerCase();int mb=f.data.length/(1024*1024);
    if(kind.equals("poster")){if(mb>25)return Rule.bad("Poster must be smaller than 25 MB.");if(n.endsWith(".png")&&sig(f.data,new byte[]{(byte)137,80,78,71}))return Rule.ok(".png");if((n.endsWith(".jpg")||n.endsWith(".jpeg"))&&sig(f.data,new byte[]{(byte)255,(byte)216,(byte)255}))return Rule.ok(".jpg");if(n.endsWith(".webp")&&ascii(f.data,8,4).equals("WEBP"))return Rule.ok(".webp");return Rule.bad("Poster must be a valid PNG, JPG or WebP image.");}
    if(kind.equals("brochure")){if(mb>60)return Rule.bad("Brochure must be smaller than 60 MB.");return n.endsWith(".pdf")&&sig(f.data,"%PDF-".getBytes(StandardCharsets.US_ASCII))?Rule.ok(".pdf"):Rule.bad("Brochure must be a valid PDF.");}
    if(mb>250)return Rule.bad("Video must be smaller than 250 MB.");if(n.endsWith(".mp4")&&ascii(f.data,4,4).equals("ftyp"))return Rule.ok(".mp4");if(n.endsWith(".webm")&&sig(f.data,new byte[]{26,69,(byte)223,(byte)163}))return Rule.ok(".webm");return Rule.bad("Video must be a valid MP4 or WebM file.");
  }
  static boolean sig(byte[] a,byte[] b){if(a.length<b.length)return false;for(int i=0;i<b.length;i++)if(a[i]!=b[i])return false;return true;}
  static String ascii(byte[] b,int s,int n){return b.length<s+n?"":new String(b,s,n,StandardCharsets.US_ASCII);}

  static Map<String,Part> multipart(byte[] body,String boundary){Map<String,Part> out=new HashMap<>();byte[] mark=("--"+boundary).getBytes(StandardCharsets.ISO_8859_1),next=("\r\n--"+boundary).getBytes(StandardCharsets.ISO_8859_1),gap="\r\n\r\n".getBytes(StandardCharsets.ISO_8859_1);int at=find(body,mark,0);
    while(at>=0){int hs=at+mark.length;if(hs+2<=body.length&&body[hs]=='-'&&body[hs+1]=='-')break;if(hs+2<=body.length&&body[hs]=='\r')hs+=2;int he=find(body,gap,hs);if(he<0)break;int cs=he+4,ce=find(body,next,cs);if(ce<0)break;String h=new String(body,hs,he-hs,StandardCharsets.ISO_8859_1),d=header(h,"Content-Disposition"),name=param(d,"name"),fn=param(d,"filename");if(!name.isEmpty())out.put(name,new Part(fn,Arrays.copyOfRange(body,cs,ce)));at=ce+2;}return out;}
  static int find(byte[] s,byte[] t,int from){outer:for(int i=from;i<=s.length-t.length;i++){for(int j=0;j<t.length;j++)if(s[i+j]!=t[j])continue outer;return i;}return-1;}
  static String header(String h,String key){for(String l:h.split("\\r\\n")){int c=l.indexOf(':');if(c>0&&l.substring(0,c).trim().equalsIgnoreCase(key))return l.substring(c+1).trim();}return"";}
  static String param(String d,String key){String pre=key+"=\"";for(String i:d.split(";")){i=i.trim();if(i.startsWith(pre)&&i.endsWith("\""))return i.substring(pre.length(),i.length()-1);}return"";}
  static String boundary(String h){if(h==null)return null;for(String i:h.split(";")){i=i.trim();if(i.startsWith("boundary=")){String b=i.substring(9);if(b.startsWith("\"")&&b.endsWith("\""))b=b.substring(1,b.length()-1);return b;}}return null;}
  static String text(Map<String,Part> p,String k){return p.containsKey(k)?new String(p.get(k).data,StandardCharsets.UTF_8).trim():"";}

  static class StaticHandler implements HttpHandler{public void handle(HttpExchange x)throws IOException{if(!x.getRequestMethod().equals("GET")&&!x.getRequestMethod().equals("HEAD")){textResponse(x,405,"Method not allowed");return;}String req=cleanPath(x.getRequestURI()),route=ROUTES.getOrDefault(req,req);if(!publicPath(route)){textResponse(x,404,"Page not found");return;}Path file=ROOT.resolve(route).normalize();if(!file.startsWith(ROOT)||!Files.isRegularFile(file)){textResponse(x,404,"Page not found");return;}Headers h=x.getResponseHeaders();h.set("Content-Type",mime(file));h.set("X-Content-Type-Options","nosniff");String lower=route.toLowerCase();boolean refreshable=lower.endsWith(".html")||lower.endsWith(".css")||lower.endsWith(".js");h.set("Cache-Control",refreshable?"no-cache, no-store, must-revalidate":"public, max-age=86400");if(route.equals("admin.html"))h.set("X-Frame-Options","DENY");long size=Files.size(file);x.sendResponseHeaders(200,x.getRequestMethod().equals("HEAD")?-1:size);if(!x.getRequestMethod().equals("HEAD"))try(OutputStream o=x.getResponseBody()){Files.copy(file,o);}x.close();}}
  static boolean publicPath(String p){if(p.startsWith("data/")||p.contains("..")||p.endsWith(".java")||p.endsWith(".bat")||p.endsWith(".txt"))return false;String s=p.toLowerCase();return List.of(".html",".css",".js",".png",".jpg",".jpeg",".webp",".svg",".mp4",".webm",".pdf",".ico").stream().anyMatch(s::endsWith);}
  static String mime(Path p){String n=p.toString().toLowerCase();if(n.endsWith(".html"))return"text/html; charset=utf-8";if(n.endsWith(".css"))return"text/css; charset=utf-8";if(n.endsWith(".js"))return"application/javascript; charset=utf-8";if(n.endsWith(".png"))return"image/png";if(n.endsWith(".jpg")||n.endsWith(".jpeg"))return"image/jpeg";if(n.endsWith(".webp"))return"image/webp";if(n.endsWith(".svg"))return"image/svg+xml";if(n.endsWith(".mp4"))return"video/mp4";if(n.endsWith(".webm"))return"video/webm";if(n.endsWith(".pdf"))return"application/pdf";return"application/octet-stream";}

  static boolean method(HttpExchange x,String m)throws IOException{if(x.getRequestMethod().equalsIgnoreCase(m))return true;json(x,405,"{\"ok\":false,\"message\":\"Method not allowed\"}");return false;}
  static byte[] readLimit(InputStream in,int max)throws IOException{ByteArrayOutputStream o=new ByteArrayOutputStream();byte[] b=new byte[65536];int n,total=0;while((n=in.read(b))!=-1){total+=n;if(total>max)throw new IOException("too large");o.write(b,0,n);}return o.toByteArray();}
  static Map<String,String> form(String s){Map<String,String> m=new HashMap<>();for(String p:s.split("&")){String[] v=p.split("=",2);m.put(URLDecoder.decode(v[0],StandardCharsets.UTF_8),v.length>1?URLDecoder.decode(v[1],StandardCharsets.UTF_8):"");}return m;}
  static String cleanPath(URI u){String p=URLDecoder.decode(u.getPath(),StandardCharsets.UTF_8).replace('\\','/');while(p.startsWith("/"))p=p.substring(1);while(p.endsWith("/")&&!p.isEmpty())p=p.substring(0,p.length()-1);return p;}
  static void json(HttpExchange x,int code,String s)throws IOException{byte[] b=s.getBytes(StandardCharsets.UTF_8);x.getResponseHeaders().set("Content-Type","application/json; charset=utf-8");x.getResponseHeaders().set("Cache-Control","no-store");x.sendResponseHeaders(code,b.length);try(OutputStream o=x.getResponseBody()){o.write(b);}x.close();}
  static void textResponse(HttpExchange x,int code,String s)throws IOException{byte[] b=s.getBytes(StandardCharsets.UTF_8);x.sendResponseHeaders(code,b.length);try(OutputStream o=x.getResponseBody()){o.write(b);}x.close();}
  static boolean equal(String a,String b){if(a==null||b==null)return false;try{MessageDigest d=MessageDigest.getInstance("SHA-256");return MessageDigest.isEqual(d.digest(a.getBytes(StandardCharsets.UTF_8)),d.digest(b.getBytes(StandardCharsets.UTF_8)));}catch(Exception e){return false;}}
  static String random(int n){byte[] b=new byte[n];RANDOM.nextBytes(b);return Base64.getUrlEncoder().withoutPadding().encodeToString(b);}
  static String enc(String s){return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes(StandardCharsets.UTF_8));}static String dec(String s){return new String(Base64.getUrlDecoder().decode(s),StandardCharsets.UTF_8);}
  static String clean(String s,int n){if(s==null)return"";s=s.replaceAll("[\\p{Cntrl}&&[^\\r\\n\\t]]","").trim();return s.length()>n?s.substring(0,n):s;}
  static String esc(String s){if(s==null)return"";return s.replace("\\","\\\\").replace("\"","\\\"").replace("\r","\\r").replace("\n","\\n");}
  static String env(String k,String d){String v=System.getenv(k);return v==null||v.isBlank()?d:v;}
  static final class Session{final String csrf;final long expires;Session(String c,long e){csrf=c;expires=e;}}
  static final class Part{final String filename;final byte[] data;Part(String f,byte[] d){filename=f==null?"":f;data=d;}}
  static final class Rule{final boolean ok;final String ext,error;Rule(boolean o,String x,String e){ok=o;ext=x;error=e;}static Rule ok(String x){return new Rule(true,x,"");}static Rule bad(String e){return new Rule(false,"",e);}}
  static final class Item{final String id,kind,brand,title,desc,url,original;final long time;Item(String i,long t,String k,String b,String ti,String d,String u,String o){id=i;time=t;kind=k;brand=b;title=ti;desc=d;url=u;original=o;}}
}
