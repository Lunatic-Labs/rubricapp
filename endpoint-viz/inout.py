from pathlib import Path
from typing import List

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


def files_from_ext(path: str | Path, ext: str) -> List[Path]:
    directory = Path(path)

    if not directory.exists():
        raise FileNotFoundError(f"Directory not found: {directory}")
    if not directory.is_dir():
        raise NotADirectoryError(f"Path is not a directory: {directory}")

    if not ext.startswith('.'):
        ext = '.' + ext

    return sorted(list(directory.glob(f"*{ext}")))
