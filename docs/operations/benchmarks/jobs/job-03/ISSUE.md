SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

httpFancyWriter.ReadFrom double-counts BytesWritten when Tee is set

https://github.com/go-chi/chi/issues/1067

## Description

`httpFancyWriter.ReadFrom` in `middleware/wrap_writer.go` double-counts the bytes written when a `Tee` writer is set.

## Reproduction

```go
func TestHttpFancyWriterReadFromWithTee(t *testing.T) {
	original := &httptest.ResponseRecorder{
		HeaderMap: make(http.Header),
		Body:      new(bytes.Buffer),
	}
	f := &httpFancyWriter{basicWriter: basicWriter{ResponseWriter: original}}

	var teeBuf bytes.Buffer
	f.Tee(&teeBuf)

	input := "hello world"
	n, err := f.ReadFrom(strings.NewReader(input))
	// n == 11, err == nil
	// f.BytesWritten() == 22  -- BUG: should be 11
}
```


Redactions: Removed solution-revealing implementation diagnosis and Fix section; preserved original failure description and reproduction.
Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
