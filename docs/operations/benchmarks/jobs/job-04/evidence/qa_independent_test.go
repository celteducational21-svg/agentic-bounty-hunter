package chi
import("net/http";"net/http/httptest";"testing")
func TestQAPatternComposition(t *testing.T){
 for _,tc:=range []struct{path,pattern string}{{"/api/teams/4/", "/api/teams/{team}"},{"/api/teams/4/items/9", "/api/teams/{team}/items/{item}"}}{
  t.Run(tc.path,func(t *testing.T){r:=NewRouter();seen:="";r.Use(func(next http.Handler)http.Handler{return http.HandlerFunc(func(w http.ResponseWriter,q *http.Request){next.ServeHTTP(w,q);seen=q.Pattern})});r.Route("/api",func(r Router){r.Group(func(r Router){r.Route("/teams/{team}",func(r Router){h:=func(w http.ResponseWriter,q *http.Request){if q.Pattern!=tc.pattern{t.Errorf("got %q expected %q",q.Pattern,tc.pattern)};if URLParam(q,"team")!="4"{t.Error("param lost")}};r.Get("/",h);r.Get("/items/{item}",h)})})});w:=httptest.NewRecorder();r.ServeHTTP(w,httptest.NewRequest("GET",tc.path,nil));if w.Code!=200||seen!=tc.pattern{t.Fatalf("status=%d seen=%q",w.Code,seen)}})
 }
}
