import itertools,tempfile,pathlib
from dotenv import set_key,get_key
with tempfile.TemporaryDirectory() as d:
 p=pathlib.Path(d)/'data.env'; count=0
 for n in range(5):
  for chars in itertools.product(['\\',"'",'"','a',' ','\n'],repeat=n):
   value=''.join(chars)
   for mode in ['always','auto']:
    p.write_text('UNRELATED=keep\nVALUE=old\n')
    set_key(p,'VALUE',value,quote_mode=mode)
    got=get_key(p,'VALUE')
    assert got==value,(repr(value),repr(got),p.read_text())
    assert get_key(p,'UNRELATED')=='keep'
    count+=1
print(f'PASS independent exhaustive quoted round trips: {count} cases; slash, apostrophe, quote, spaces, newline, empty; unrelated key retained')
