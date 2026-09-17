package godotenv
import("reflect";"testing")
func TestQAMixedNewlineBoundaries(t *testing.T){
 count:=0
 for _,a:=range []string{"\n","\r\n","\r"}{for _,b:=range []string{"\n","\r\n","\r"}{for _,c:=range []string{"\n","\r\n","\r"}{
  source:="A=foo bar"+a+"# comment"+b+"EMPTY="+c+"B='quoted value'"+a+"C=last value"+b
  got,e:=Unmarshal(source);want:=map[string]string{"A":"foo bar","EMPTY":"","B":"quoted value","C":"last value"};if e!=nil||!reflect.DeepEqual(got,want){t.Fatalf("newlines=%q,%q,%q got=%#v err=%v",a,b,c,got,e)};count++
 }}}
 for _,sep:=range []string{"\n","\r\n","\r"}{got,e:=Unmarshal("A=foo"+sep+"B=bar");if e!=nil||!reflect.DeepEqual(got,map[string]string{"A":"foo","B":"bar"}){t.Fatalf("auditor repro separator=%q got=%#v err=%v",sep,got,e)}}
 t.Logf("PASS %d mixed separator forms +3 original regression forms",count)
}
