import itertools,tempfile,pathlib,io,json
from dotenv import set_key,dotenv_values
count=0
with tempfile.TemporaryDirectory() as d:
 p=pathlib.Path(d)/'data.env'
 for n in range(5):
  for chars in itertools.product(['\\',"'",'"','a',' ','\n'],repeat=n):
   value=''.join(chars)
   for mode in ['always','auto']:
    p.write_text('BEFORE="original"\n')
    set_key(p,'A',value,quote_mode=mode);set_key(p,'B',"sentinel'\"",quote_mode=mode)
    assert dotenv_values(p)=={'BEFORE':'original','A':value,'B':"sentinel'\""},(repr(value),repr(p.read_text()),dotenv_values(p))
    set_key(p,'A',value,quote_mode=mode)
    assert dotenv_values(p)=={'BEFORE':'original','A':value,'B':"sentinel'\""}
    count+=1
# Existing double-quoted parsing regression controls, including slash before nonquote and escaped quote.
for source,expect in [('A="hello"\nB="world"',{'A':'hello','B':'world'}),('A="C:\\Users"\nB="sentinel"',{'A':r'C:\Users','B':'sentinel'}),('A="a\\\"b"\nB="sentinel"',{'A':'a"b','B':'sentinel'}),('A=""\nB=\'\'',{'A':'','B':''})]:
 assert dotenv_values(stream=io.StringIO(source))==expect,(source,dotenv_values(stream=io.StringIO(source)))
print(f'PASS {count} multi-binding insert/update roundtrips plus4double/mixed-quote parser controls')
