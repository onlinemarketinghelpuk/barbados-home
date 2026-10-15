# Unpack bmsr-images.json (from get-images.js) into this folder.
import base64, json, pathlib, sys
here = pathlib.Path(__file__).parent
src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path.home() / 'Downloads' / 'bmsr-images.json'
data = json.loads(src.read_text(encoding='utf8'))
for name, uri in data.items():
    (here / name).write_bytes(base64.b64decode(uri.split(',', 1)[1]))
print(f'{len(data)} images written to {here}')
