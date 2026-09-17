import subprocess, sys, os, time
from pathlib import Path
root=Path(__file__).resolve().parent.parent
os.chdir(root/'repo')
env=dict(os.environ, PATH=str(root/'venv/bin')+':'+os.environ['PATH'])
cmd=sys.argv[1]
start=time.time()
p=subprocess.run(cmd,shell=True,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,env=env)
with (root/'evidence/commands.log').open('a') as f:
 f.write('\n$ '+cmd+'\n'+p.stdout+'\nexit='+str(p.returncode)+' seconds='+str(round(time.time()-start,2))+'\n')
print(p.stdout)
print('exit='+str(p.returncode))
sys.exit(p.returncode)
