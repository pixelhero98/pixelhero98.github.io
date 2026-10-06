from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1]
im=Image.new("RGB",(1200,630),"white")
d=ImageDraw.Draw(im)
font=lambda n:ImageFont.truetype("C:/Windows/Fonts/arial.ttf",n)
bold=lambda n:ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf",n)
d.text((86,106),"Zinuo (Henry) You",font=bold(66),fill="#20262d")
d.text((90,207),"Generative modelling · World models · Optimization",font=font(30),fill="#245f91")
d.line((90,293,1110,293),fill="#dfe5ea",width=2)
d.text((90,345),"Research, papers & interactive explanations",font=font(30),fill="#20262d")
d.text((90,403),"University of Bristol",font=font(28),fill="#59636d")
d.text((90,530),"pixelhero98.github.io",font=font(25),fill="#245f91")
im.save(root/"public/og.jpg",quality=92)
