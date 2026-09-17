from pathlib import Path
import shlex
from click.testing import CliRunner
from dotenv.cli import cli
from dotenv import dotenv_values
commands=[shlex.split(line[9:]) for line in Path('README.md').read_text().splitlines() if line.startswith('$ dotenv set ')]
assert len(commands)==2
runner=CliRunner()
with runner.isolated_filesystem():
 for args in commands:
  out=runner.invoke(cli,['--file','.env']+args)
  assert out.exit_code==0,out.output
  print('PASS: dotenv '+' '.join(args))
 assert dotenv_values('.env')=={'USER':'foo','EMAIL':'foo@example.org'}
 print('PASS: persisted USER and EMAIL match documented values')
