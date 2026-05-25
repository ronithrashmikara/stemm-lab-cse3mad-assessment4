from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="DocTitle", parent=styles["Title"], fontSize=20, leading=24, textColor=colors.HexColor("#17324d")))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontSize=14, leading=18, textColor=colors.HexColor("#17324d"), spaceBefore=10))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontSize=11.5, leading=15, textColor=colors.HexColor("#245a78"), spaceBefore=8))
styles.add(ParagraphStyle(name="BodyX", parent=styles["BodyText"], fontSize=9, leading=12, textColor=colors.HexColor("#17212b"), spaceAfter=4))
styles.add(ParagraphStyle(name="CodeX", parent=styles["Code"], fontSize=7.5, leading=10, backColor=colors.HexColor("#f1f5f9")))


def build_pdf(markdown_file: Path) -> Path:
    pdf_file = markdown_file.with_suffix(".pdf")
    story = []
    list_items = []
    in_code = False
    code_lines = []

    def flush_list():
        nonlocal list_items
        if list_items:
            story.append(ListFlowable([ListItem(Paragraph(esc(item), styles["BodyX"])) for item in list_items], bulletType="bullet", leftIndent=14))
            list_items = []

    def flush_code():
        nonlocal code_lines
        if code_lines:
            story.append(Paragraph("<br/>".join(esc(line) for line in code_lines), styles["CodeX"]))
            story.append(Spacer(1, 4))
            code_lines = []

    for raw in markdown_file.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()

        if line.startswith("```"):
            if in_code:
                flush_code()
                in_code = False
            else:
                flush_list()
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line.strip():
            flush_list()
            story.append(Spacer(1, 4))
            continue

        if line.startswith("# "):
            flush_list()
            story.append(Paragraph(esc(line[2:]), styles["DocTitle"]))
        elif line.startswith("## "):
            flush_list()
            story.append(Paragraph(esc(line[3:]), styles["H1x"]))
        elif line.startswith("### "):
            flush_list()
            story.append(Paragraph(esc(line[4:]), styles["H2x"]))
        elif line.startswith("- [ ] "):
            list_items.append("[ ] " + line[6:])
        elif line.startswith("- "):
            list_items.append(line[2:])
        elif line.startswith("|"):
            flush_list()
            # Lightweight markdown table support.
            cells = [cell.strip() for cell in line.strip("|").split("|")]
            if cells and not all(set(cell) <= {"-", " "} for cell in cells):
                story.append(Paragraph(" | ".join(esc(cell) for cell in cells), styles["BodyX"]))
        else:
            flush_list()
            story.append(Paragraph(esc(line), styles["BodyX"]))

    flush_list()
    flush_code()

    doc = SimpleDocTemplate(str(pdf_file), pagesize=A4, rightMargin=1.5 * cm, leftMargin=1.5 * cm, topMargin=1.4 * cm, bottomMargin=1.3 * cm)
    doc.build(story)
    return pdf_file


def main():
    files = [
        DOCS / "user_manual.md",
        DOCS / "testing_and_deployment_report.md",
        DOCS / "presentation_script.md",
        DOCS / "firebase_test_lab_steps.md",
        DOCS / "submission_checklist.md",
    ]
    for file in files:
        print(build_pdf(file))


if __name__ == "__main__":
    main()
