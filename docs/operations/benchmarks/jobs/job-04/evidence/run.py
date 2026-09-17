import subprocess, sys, datetime
from pathlib import Path
p = subprocess.run(sys.argv[1:],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
s=f'\n[{datetime.datetime.now(datetime.timezone.utc).isoformat()}] $ {" ".join(sys.argv[1:])}\n{p.stdout}\nEXIT {p.returncode}\n'
with Path(__file__).with_name('commands.log').open('a') as f:f.write(s)
print(s)
sys.exit(p.returncode)
