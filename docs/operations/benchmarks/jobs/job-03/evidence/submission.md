# Unpublished PR draft
SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Branch: fix/readfrom-tee-bytes
PR title: Fix double-counted response bytes when ReadFrom uses Tee
Issue: https://github.com/go-chi/chi/issues/1067

The Tee path copies through basicWriter.Write, which already updates BytesWritten. The extra increment in ReadFrom doubles the copied byte count and makes response metrics incorrect. Return the copy result directly so bytes are counted once, preserving the non-tee fast path.

Add regression coverage for Tee on/off, ordinary Reader and WriterTo paths, prior writes, output contents, status and return values. The tee cases fail on the pre-fix source and pass with this patch. Full tests with race detector, go vet, go build and formatting checks are recorded in commands.log. Frozen commit is in result.json. No public action taken.
