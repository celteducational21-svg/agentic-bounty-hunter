import tempfile
from pathlib import Path
import dotenv
print('Imported:', dotenv.__file__)
failures = []
with tempfile.TemporaryDirectory() as directory:
    path = Path(directory) / '.env'
    for value in [r'C:\Users', r'\d+', r'\\server\share', r'\\d+', 'C:\\Users\\', "before\\'after", '\\\\']:
        path.write_text('')
        dotenv.set_key(path, 'VALUE', value)
        actual = dotenv.get_key(path, 'VALUE')
        print(f'input={value!r} file={path.read_text()!r} read={actual!r} equal={actual == value}')
        if actual != value:
            failures.append((value, actual))
assert not failures, failures
