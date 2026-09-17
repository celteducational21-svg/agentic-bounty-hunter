"""Post-freeze behavioral counterexample. Not an independent pre-reveal test."""
from pathlib import Path
from tempfile import TemporaryDirectory
from dotenv import get_key, set_key

with TemporaryDirectory() as directory:
    path = Path(directory) / '.env'
    path.touch()
    set_key(path, 'a', 'back\\')
    set_key(path, 'b', 'sentinel')
    print(repr(path.read_text()))
    actual = (get_key(path, 'a'), get_key(path, 'b'))
    print('expected:', ('back\\', 'sentinel'), 'actual:', actual)
    assert actual == ('back\\', 'sentinel')
