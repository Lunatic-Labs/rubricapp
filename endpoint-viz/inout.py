import os
from pathlib import Path
from typing import List, Union, Optional

def load_file(path: str) -> str:
    try:
        src = None
        with open(path, 'r', encoding='utf8') as f:
            src = f.read()
            assert src is not None
            return bytes(src, encoding='utf8')
    except Exception as e:
        print(f'error: {e}', file=sys.stderr)
        return None


def collect_files_by_extension(root_path: Union[str, os.PathLike],
                               extension: str,
                               exclude:   Optional[List[str]] = None) -> List[str]:
    if not extension.startswith('.'):
        extension = '.' + extension

    if exclude is None:
        exclude = []

    exclude_set = {name.lower() for name in exclude}

    matching_files: List[str] = []

    for dirpath, dirnames, filenames in os.walk(root_path):
        dirnames[:] = [d for d in dirnames if d.lower() not in exclude_set]

        current_dir_name = os.path.basename(dirpath).lower()
        if current_dir_name in exclude_set and dirpath != str(root_path):
            continue

        for filename in filenames:
            if filename.lower() in exclude_set:
                continue

            if filename.lower().endswith(extension.lower()):
                full_path = os.path.join(dirpath, filename)
                matching_files.append(full_path)

    return matching_files
