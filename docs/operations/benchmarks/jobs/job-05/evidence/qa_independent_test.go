package godotenv
import("reflect";"testing")
func TestQAWhitespaceComposition(t *testing.T){for _,tc:=range []struct{input string;want map[string]string}{
 {"A=one two\nB='three four'\nC=\"five six\"",map[string]string{"A":"one two","B":"three four","C":"five six"}},
 {"A=foo bar  \n# comment\n\nB=next value # tail",map[string]string{"A":"foo bar","B":"next value"}},
 {"A=hello\nB=${A} big world\nC=  \nD=x y",map[string]string{"A":"hello","B":"hello big world","C":"","D":"x y"}},
 {"export A = foo bar\r\nB: baz qux\r\n",map[string]string{"A":"foo bar","B":"baz qux"}},
 {"A=héllo 世界\nB=foo\tbar #note\n",map[string]string{"A":"héllo 世界","B":"foo\tbar"}},
 }{v,e:=Unmarshal(tc.input);if e!=nil||!reflect.DeepEqual(v,tc.want){t.Errorf("input=%q got=%#v err=%v want=%#v",tc.input,v,e,tc.want)}}}
