import itertools
from more_itertools import split_after
count=0
for size in range(7):
 for items in itertools.product([0,1],repeat=size):
  for maxsplit in [-1,0,1,2,3,8]:
   if maxsplit==0:want=[list(items)]
   else:
    want=[];buf=[];remaining=maxsplit
    for x in items:
     buf.append(x)
     if x==1 and remaining!=0:want.append(buf);buf=[];remaining-=1
    if buf:want.append(buf)
   assert list(split_after(iter(items),lambda x:x==1,maxsplit=maxsplit))==want,(items,maxsplit,want)
   count+=1
seen=[];calls=[]
def source():
 for x in [0,1,2,3]:seen.append(x);yield x
it=split_after(source(),lambda x:(calls.append(x) or x==1),maxsplit=1)
assert seen==[];assert next(it)==[0,1];assert seen==[0,1];assert calls==[0,1]
assert next(it)==[2,3];assert calls==[0,1]
assert list(it)==[]
print(f'PASS {count} independently computed boundary cases plus lazy-source and no-predicate-after-limit assertions')
