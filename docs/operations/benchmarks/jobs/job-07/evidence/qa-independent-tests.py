import os
from pathlib import Path
import pytest
from boltons.fileutils import atomic_save, iter_find_files, path_to_unicode

class BytesPath:
    def __init__(self, value): self.value = os.fsencode(value)
    def __fspath__(self): return self.value
    def __str__(self): raise AssertionError('Must use protocol')

def test_bytes_protocol_atomic_and_abort(tmp_path):
    dest = tmp_path / 'résumé.txt'
    dest.write_bytes(b'old')
    with pytest.raises(ValueError):
        with atomic_save(BytesPath(dest), part_file=BytesPath('custom.tmp')) as f:
            f.write(b'partial')
            raise ValueError('cancel')
    assert dest.read_bytes() == b'old'
    assert not (tmp_path / 'custom.tmp').exists()
    with atomic_save(BytesPath(dest), part_file=Path('custom.tmp')) as f:
        f.write(b'new')
    assert dest.read_bytes() == b'new'

def test_overwrite_false_preserves_original(tmp_path):
    dest = tmp_path / 'exists.txt'
    dest.write_bytes(b'old')
    with pytest.raises(OSError):
        with atomic_save(dest, overwrite=False) as f: f.write(b'new')
    assert dest.read_bytes() == b'old'

def test_depth_ignore_and_bytes_protocol(tmp_path):
    (tmp_path / 'skip.txt').write_text('skip')
    (tmp_path / 'keep.txt').write_text('keep')
    child = tmp_path / 'child'
    child.mkdir()
    (child / 'nested.txt').write_text('deep')
    assert list(iter_find_files(BytesPath(tmp_path), '*.txt', ignored='skip*', max_depth=0)) == [str(tmp_path / 'keep.txt')]

def test_invalid_protocol_rejected():
    class Invalid:
        def __fspath__(self): return 12
    with pytest.raises(TypeError): path_to_unicode(Invalid())
