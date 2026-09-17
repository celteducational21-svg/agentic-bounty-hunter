package main
import("fmt";"github.com/joho/godotenv")
func main(){
 for _,s:=range []string{"A=foo\rB=bar", "A=foo bar\rB=baz", "A=foo bar # comment # second\nB=baz"}{
 v,e:=godotenv.Unmarshal(s);fmt.Printf("input=%q values=%#v error=%v\n",s,v,e)
 }
}
