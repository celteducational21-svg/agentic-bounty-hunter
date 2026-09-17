package middleware
import("bytes";"errors";"io";"net/http";"net/http/httptest";"strings";"testing")
type qaPartial struct{*httptest.ResponseRecorder}
func(p *qaPartial)Write(b []byte)(int,error){p.ResponseRecorder.Write(b[:2]);return 2,io.ErrClosedPipe}
type qaFailTee struct{}
func(qaFailTee)Write(b []byte)(int,error){return 0,io.ErrClosedPipe}
func TestQAReadFromAccounting(t *testing.T){
 for _,discard:=range []bool{false,true}{
  raw:=httptest.NewRecorder();f:=&httpFancyWriter{basicWriter:basicWriter{ResponseWriter:raw}};var tee bytes.Buffer;f.Tee(&tee);if discard{f.Discard()}
  for _,s:=range []string{"","abc","de",""}{n,e:=f.ReadFrom(struct{io.Reader}{strings.NewReader(s)});if n!=int64(len(s))||e!=nil{t.Fatalf("n=%d e=%v",n,e)}}
  if f.BytesWritten()!=5||tee.String()!="abcde"{t.Fatalf("bytes=%d tee=%q",f.BytesWritten(),tee.String())};if !discard&&raw.Body.String()!="abcde"{t.Fatal("body")}
 }
 t.Run("partial downstream error",func(t *testing.T){p:=&qaPartial{httptest.NewRecorder()};f:=&httpFancyWriter{basicWriter:basicWriter{ResponseWriter:p}};var tee bytes.Buffer;f.Tee(&tee);n,e:=f.ReadFrom(strings.NewReader("abcdef"));if n!=2||!errors.Is(e,io.ErrClosedPipe)||f.BytesWritten()!=2||tee.String()!="ab"||f.Status()!=http.StatusOK{t.Fatalf("%d %v %d %q",n,e,f.BytesWritten(),tee.String())}})
 t.Run("tee error",func(t *testing.T){raw:=httptest.NewRecorder();f:=&httpFancyWriter{basicWriter:basicWriter{ResponseWriter:raw}};f.Tee(qaFailTee{});n,e:=f.ReadFrom(strings.NewReader("abcdef"));if n!=6||!errors.Is(e,io.ErrClosedPipe)||f.BytesWritten()!=6{t.Fatalf("%d %v %d",n,e,f.BytesWritten())}})
}
