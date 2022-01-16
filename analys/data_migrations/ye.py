import os

cur_path = os.path.dirname(__file__)
print(cur_path)

new_path = os.path.relpath('..\\subfldr1\\testfile.txt', cur_path)
print(new_path)
# with open(new_path, 'w') as f:
# f.write(data)
