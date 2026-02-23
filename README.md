# latrunculi

Playable Latrunculi (v1) prototype in Python with:
- Rules engine (movement, custodial capture, terminal detection)
- CLI gameplay
- Basic AI opponent (minimax + alpha-beta)
- Pytest suite and CI

## Quick start
```bash
python -m pytest
python -m latrunculi.cli
python -m latrunculi.cli --vs-ai --ai-side B --depth 2
```

## Docs
- Rules: `docs/RULES.md`
- Design: `docs/DESIGN.md`
