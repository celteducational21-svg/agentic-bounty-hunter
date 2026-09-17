from pathlib import Path
import shlex
from click.testing import CliRunner
from dotenv.cli import cli
readme=Path('README.md').read_text()
r=CliRunner()
with r.isolated_filesystem():
 for line in readme.splitlines():
  if line.startswith('$ dotenv set '):
   args=shlex.split(line[9:])
   out=r.invoke(cli,['--file','.env']+args)
   print(line, '\nexit=',out.exit_code,'\n'+out.output)
 good=r.invoke(cli,['--file','.env','set','USER','foo'])
 print('Control: dotenv set USER foo\nexit=',good.exit_code,'\n'+good.output)
 print('file:',Path('.env').read_text())
