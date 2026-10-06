"""Build the standalone public CV. The private source PDF is never modified."""
from pathlib import Path
from xml.sax.saxutils import escape
import hashlib
import sys
import json
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, PageBreak
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public/resume/Zinuo_You_EN.pdf"
FONT=Path(sys.argv[1]) if len(sys.argv)>1 else Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("CVSans",str(FONT/"arial.ttf")))
pdfmetrics.registerFont(TTFont("CVSans-Bold",str(FONT/"arialbd.ttf")))
pdfmetrics.registerFontFamily("CVSans",normal="CVSans",bold="CVSans-Bold",italic="CVSans",boldItalic="CVSans-Bold")
ink=colors.HexColor("#20262d");blue=colors.HexColor("#245f91")
styles={
 "name":ParagraphStyle("name",fontName="CVSans-Bold",fontSize=23,leading=27,textColor=ink,spaceAfter=7),
 "tag":ParagraphStyle("tag",fontName="CVSans",fontSize=9,leading=12,textColor=blue,spaceAfter=9),
 "body":ParagraphStyle("body",fontName="CVSans",fontSize=9.2,leading=11.6,textColor=ink,spaceAfter=4),
 "section":ParagraphStyle("section",fontName="CVSans-Bold",fontSize=10,leading=13,textColor=blue,spaceBefore=9,spaceAfter=5),
 "title":ParagraphStyle("title",fontName="CVSans-Bold",fontSize=9.7,leading=12.5,textColor=ink,spaceAfter=3),
 "meta":ParagraphStyle("meta",fontName="CVSans",fontSize=8.5,leading=11,textColor=colors.HexColor("#59636d"),spaceAfter=5),
 "bullet":ParagraphStyle("bullet",fontName="CVSans",fontSize=9.1,leading=11.5,textColor=ink,leftIndent=10,firstLineIndent=-8,spaceAfter=3),
 "pub":ParagraphStyle("pub",fontName="CVSans",fontSize=8.6,leading=11.4,textColor=ink,spaceAfter=6),
}
story=[]
def p(text,style="body"): return Paragraph(text,styles[style])
def section(title):story.append(p(title.upper(),"section"))
def block(title,meta,bullets):
 story.append(KeepTogether([p(escape(title),"title"),p(escape(meta),"meta"),p("• "+escape(bullets[0]),"bullet")]))
 for text in bullets[1:]:story.append(p("• "+escape(text),"bullet"))
 story.append(Spacer(1,3))
story.extend([p("Zinuo (Henry) You","name"),p("GENERATIVE MODELLING &amp; WORLD MODELS · RL &amp; DISTILLATION · OPTIMIZATION","tag"),
p('<link href="mailto:zinuo.you@bristol.ac.uk" color="#245f91">zinuo.you@bristol.ac.uk</link>  |  <link href="https://github.com/pixelhero98" color="#245f91">GitHub</link>  |  <link href="https://scholar.google.com/citations?user=ck7JGfgAAAAJ" color="#245f91">Google Scholar</link>  |  <link href="https://pixelhero98.github.io/" color="#245f91">Website</link>',"meta")])
section("Profile")
story.append(p("PhD researcher in Engineering Mathematics and Computer Science at the University of Bristol, working at the intersection of generative modelling, reinforcement learning, and optimization. Research spans long-horizon consistency and parameter-efficient post-training for video/world models; diffusion, flow matching, and Schrödinger bridges; and efficient generative inference. First-author publications include an ICML 2026 Spotlight, AAAI 2026, and ICASSP 2024. Experienced across problem formulation, implementation, multi-GPU training, and cross-task evaluation."))
section("Education")
for text in ["<b>University of Bristol</b> · PhD, Engineering Mathematics and Computer Science · 2023-present","<b>University of Sheffield</b> · MSc, Electronic and Electrical Engineering, Distinction · 2019-2020","<b>Southwest University</b> · Bachelor's, Electronic Science and Technology / Solid-State Physics · 2015-2019"]:story.append(p(text))
section("Technical skills")
story.append(p("<b>Generative models:</b> DiT/MMDiT, latent diffusion, flow matching, T2V/I2V/Action2V, image generation, video restoration, long-horizon rollout.<br/><b>RL &amp; optimization:</b> offline/online RL, pathwise policy optimization, reward/preference fine-tuning, finite-operator distillation, Bayesian optimization.<br/><b>Systems:</b> Python/PyTorch, LoRA/PEFT, SFT/DPO/PPO/GRPO, ODEs/SDEs, low-NFE sampling, Slurm/HPC, vLLM, INT8 quantization/NPU."))
section("Core research")
block("Finite-Time Corrective Transport for Unified Optimization and Distillation","Working paper · 2025-present",[
"Learn an NFE-conditioned corrective field over a frozen base transport, directly optimizing the deployed finite-step operator while keeping the generator and solver rule fixed.",
"Connect critic-free pathwise policy optimization through rollout adjoints/BPTT with conditional kernel score/MMD distribution matching, without dense teacher trajectories.",
"Evaluate conditional generation and restoration using I²SB, PMRF, SeedVR, SANA, and UNSB under matched NFE and optimization/reward-query budgets. Gains over corresponding baselines are approximately 11%-32% across the evaluated metrics."
])
block("Latent Laplace Diffusion for Irregular Multivariate Time Series","ICML 2026 Spotlight · 2023–2025",[
"Learn conditional diffusion in VAE latent space and generate complete forecast windows in parallel at query timestamps, avoiding regridding and sequential physical-time integration.",
"Parameterize stable trajectories with complex-conjugate poles and damping constraints, with renewal averaging and interval-aware history encoding.",
"Across seven datasets and 2%-92% missingness, report 1.2×-130× faster inference and 11%-29% lower CRPS/MSE/MAE under matched protocols."
])
section("Industry research")
block("Long-Horizon Consistency for Causal Video & Interactive World Models","Samsung AI Center-Cambridge · Research Intern · Mar-Sep 2026",[
"Build Wan2.1-1.3B + Causal-rCM T2V/Action2V evaluation across 5, 10, 20, and 40+ chunks; measure consistency and action adherence with VBench-Long/I2V and WBench/WorldRoamBench.",
"Probe VAE latents, DiT/MMDiT hidden states, and KV histories; compare online, refreshed, and recomputed strategies across HunyuanVideo-1.5-8B + minWM and Wan2.2-5B + BiWM.",
"Short-horizon drift predicts long-horizon failure (Spearman ρ = 0.61-0.70). Partition-consistency LoRA on 2×H100 reduces rollout inconsistency/drift by approximately 25%/20%, improving VBench-Long/WBench by 3%-8%."
])
story.append(PageBreak())
story.append(p("Zinuo (Henry) You","title"))
section("Additional research & experience")
block("Automotive Engineer Intern","Qualcomm · Apr-Nov 2021",[
"Support INT8 NPU deployment of real-time automotive object and trajectory detection through FP32-INT8 alignment, operator-compatibility analysis, error localization, and end-to-end evaluation.",
"Achieve approximately 40 FPS in steady-state on-device tests; establish benchmarks and failure attribution across quantization, module outputs, and runtime performance."
])
block("GNN Architecture Capacity and Financial Graph Learning","AAAI 2026 / ICASSP 2024 / ICAART 2024 · 2023-2025",[
"Develop channel-capacity-constrained estimation for GNN width and depth, reducing architecture-search time by approximately 10× while improving accuracy/F1 by 2%-11%.",
"Design dynamic stock-graph models using relational retention, graph diffusion, and decoupled representations."
])
block("Restricted-Domain LLM Audit Agents","EPSRC · Student Research Associate · Feb-Oct 2026",[
"Build an evidence-constrained agent over millions of UK corporate filings, covering 20 task categories; generate approximately 20,000 SFT examples and 20,000 preference pairs.",
"Run parameter-efficient SFT/DPO on 30B-class open models using up to 2×H100, with programmatic evaluation and vLLM batched assessment. Report 81% task pass, 79% correct refusal, and 76% correct evidence citation."
])
block("TPE-AS: Adaptive Bayesian Optimization for Black-Box Portfolio Models","UKRI-STRATIPHY · Student Research Associate · Jun 2024-Apr 2025",[
"Optimize private portfolio models with at least 25 mixed variables and expensive noisy evaluations, using a controlled evaluator isolated from private models, data, and backtesting infrastructure.",
"Combine a budget-dependent mean-variance penalty with clipped importance correction. Under 500-evaluation budgets, attain the highest annualized Sharpe in 8/12 scenarios and lowest optimization-trajectory variance in 12/12."
])
section("Publications")
pubs = {}
for slug in ["latent-laplace-diffusion", "c3e", "mgdpr", "tpe-as", "dgdnn", "dgdnn-lncs"]:
    lines=(ROOT/"src/content/publications"/(slug+".md")).read_text(encoding="utf-8").split("---")[1].strip().splitlines()
    pubs[slug]={key:json.loads(value) for key,value in (line.split(": ",1) for line in lines)}
for i,pub in enumerate(pubs.values(),1):
 authors=", ".join(pub["authors"])
 url=next(l["url"] for l in pub["links"] if l["label"]=="Paper")
 text=f'{i}. {escape(authors)}. <link href="{escape(url)}" color="#245f91">{escape(pub["title"])}</link>. {escape(pub["venue"])}.'
 if pub.get("highlight"):text+=" <b>"+escape(pub["highlight"])+".</b>"
 story.append(p(text,"pub"))
section("Honors & funding")
story.append(p("University of Bristol Scholarship (2025) · ECEF Fellowship Award (2024)<br/>Jean Golding Institute Seed Corn Fund (2023) · MCM/ICM Honorable Mention (2019)"))
def footer(canvas,doc):
 canvas.setStrokeColor(colors.HexColor("#dfe5ea"));canvas.line(40,32,A4[0]-40,32)
 canvas.setFont("CVSans",8);canvas.setFillColor(colors.HexColor("#59636d"))
 canvas.drawString(40,20,"Zinuo (Henry) You · Research CV")
 canvas.drawRightString(A4[0]-40,20,str(doc.page))
OUT.parent.mkdir(parents=True,exist_ok=True)
SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=40,leftMargin=40,topMargin=32,bottomMargin=44,title="Zinuo (Henry) You - Research CV",author="Zinuo You").build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(OUT);text="\n".join(page.extract_text() for page in reader.pages)
assert len(reader.pages)==2,f"Expected two pages, got {len(reader.pages)}"
for word in ["GICO","ICLR","Inference Clocks","Refractive"]:
 assert word.casefold() not in text.casefold(),word
print(f"Public CV: {len(reader.pages)} pages; {OUT.stat().st_size} bytes.")
