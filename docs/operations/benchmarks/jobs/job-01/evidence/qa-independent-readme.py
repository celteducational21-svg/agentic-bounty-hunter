import pathlib,re,subprocess,sys,tempfile,os
readme=pathlib.Path('README.md').read_text()
commands=re.findall(r'^\$ dotenv set (.+)$',readme,re.M)
assert commands==['USER foo','EMAIL foo@example.org'],commands
with tempfile.TemporaryDirectory() as d:
 for args in commands:
  r=subprocess.run([sys.executable,'-c','from dotenv.cli import cli; cli()','set',*args.split()],cwd=d,capture_output=True,text=True)
  assert r.returncode==0,(args,r.stderr)
 r=subprocess.run([sys.executable,'-c','from dotenv.cli import cli; cli()','list'],cwd=d,capture_output=True,text=True)
 assert r.returncode==0,r.stderr
 assert set(r.stdout.splitlines())=={'USER=foo','EMAIL=foo@example.org'},r.stdout
print('PASS independent actual README set commands and list output end-to-end')
