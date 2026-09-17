import more_itertools as mi
import inspect
values=[0,1,1,1,1,1,1,1,1,0,2,3,4,2]
actual=list(mi.unique_in_window(values,2))
print('module:',mi.__file__)
print('input:',values,'n=2 output:',actual)
print('documentation:',inspect.getdoc(mi.unique_in_window))
expected_input_window=[0,1,0,2,3,4,2]
assert actual == expected_input_window, 'Documented seen-input interpretation disagrees with actual yielded-output window'
