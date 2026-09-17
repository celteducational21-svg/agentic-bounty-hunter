import subprocess, sys, datetime
from pathlib import Path
log = Path(__file__).with_name('commands.log')
cmd = sys.argv[1:]
p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
entry = f'\n[{datetime.datetime.now(datetime.timezone.utc).isoformat()}] $ {" ".join(cmd)}\n{p.stdout}\nEXIT {p.returncode}\n'
with log.open('a') as f: f.write(entry)
print(entry)
sys.exit(p.returncode)
