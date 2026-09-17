# Solution
Return io.Copy directly for the tee branch; basicWriter.Write remains the single accounting point. Preserve direct underlying ReaderFrom fast path and its counter increment for non-tee requests.

Regression test checks direct ReadFrom with/without Tee, Reader/WriterTo sources, cumulative count after Write, returned n/error, primary and tee body, and response status. It fails before and passes after the change. Full regression with race detector, vet, build and formatting are recorded in commands.log. Go build provides type checking. Separate third-party lint is N/A: repository does not configure one; go vet and gofmt used. No QA claim; this is solver verification only.
