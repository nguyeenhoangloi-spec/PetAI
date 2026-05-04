import pathlib
import sys
import zlib

ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"


def _encode6bit(value: int) -> str:
    value = max(0, min(63, value))
    return ALPHABET[value]


def _append3bytes(b1: int, b2: int, b3: int) -> str:
    c1 = b1 >> 2
    c2 = ((b1 & 0x3) << 4) | (b2 >> 4)
    c3 = ((b2 & 0xF) << 2) | (b3 >> 6)
    c4 = b3 & 0x3F
    return (
        _encode6bit(c1 & 0x3F)
        + _encode6bit(c2 & 0x3F)
        + _encode6bit(c3 & 0x3F)
        + _encode6bit(c4 & 0x3F)
    )


def plantuml_encode(text: str) -> str:
    compressor = zlib.compressobj(level=9, wbits=-15)
    compressed = compressor.compress(text.encode("utf-8")) + compressor.flush()
    out = []
    for i in range(0, len(compressed), 3):
        b1 = compressed[i]
        b2 = compressed[i + 1] if i + 1 < len(compressed) else 0
        b3 = compressed[i + 2] if i + 2 < len(compressed) else 0
        out.append(_append3bytes(b1, b2, b3))
    return "".join(out)


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python docs/plantuml_encode_url.py <file.puml>")
        sys.exit(1)

    src = pathlib.Path(sys.argv[1]).read_text(encoding="utf-8")
    token = plantuml_encode(src)
    print("https://www.plantuml.com/plantuml/uml/" + token)


if __name__ == "__main__":
    main()
