"""Authoring helper for the Figma handoff. Generated HTML runs without a build step."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[2]
manifest = json.loads((ROOT/'assets/photography/illustrative/manifest.json').read_text(encoding='utf-8'))
photos = {r['name'].removeprefix('illustrative-'):r for r in manifest['images']}
landing_copy=json.loads((ROOT/'content/landing-copy.json').read_text(encoding='utf-8'))
research=json.loads((ROOT/'content/research.json').read_text(encoding='utf-8'))
founder_paragraphs=[p.strip() for p in (ROOT/'content/founder-story.txt').read_text(encoding='utf-8').replace('\u200e','').replace('\u200f','').split('\n\n') if p.strip()]
involvement_pathways=json.loads((ROOT/'content/involvement-pathways.json').read_text(encoding='utf-8'))
support_contributions=json.loads((ROOT/'content/support-contributions.json').read_text(encoding='utf-8'))
privacy_policy=json.loads((ROOT/'content/privacy-policy.json').read_text(encoding='utf-8'))

def contribution_options():
    bank=support_contributions['bank'];crypto=support_contributions['crypto']
    def details(rows):
        return '<dl class="support-details">'+''.join(f'<div><dt>{label}</dt><dd'+(f' id="{id}"' if id else '')+f'>{escape(value)}</dd></div>' for label,value,id in rows)+'</dl>'
    bank_card='<article class="card card__body stack"><h3>Bank transfer</h3>'
    if all(bank.get(k,'').strip() for k in ['name','accountHolder','accountNumber','currency']):
        rows=[('Bank',bank['name'],''),('Account holder',bank['accountHolder'],''),('Account number / IBAN',bank['accountNumber'],'support-bank-account'),('Currency',bank['currency'],'')]
        if bank.get('transferCode'):rows.append(('Transfer code',bank['transferCode'],''))
        bank_card+=details(rows)+'<button class="button button--secondary" type="button" data-copy-target="support-bank-account" hidden>Copy account number</button><p class="type-small">Check that your bank shows the account holder above before completing a transfer.</p>'
    else:bank_card+='<p>Bank details coming soon. Transfer instructions will appear here once provided.</p>'
    crypto_card='<article class="card card__body stack"><h3>Crypto wallet</h3>'
    if all(crypto.get(k,'').strip() for k in ['currency','network','address']):
        crypto_card+=details([('Cryptocurrency',crypto['currency'],''),('Network',crypto['network'],''),('Wallet address',crypto['address'],'support-crypto-address')])+'<button class="button button--secondary" type="button" data-copy-target="support-crypto-address" hidden>Copy wallet address</button><p class="type-small">Use the cryptocurrency and network shown above. Check the complete address before sending.</p>'
    else:crypto_card+='<p>Wallet details coming soon.</p><p>The cryptocurrency, network and public wallet address will appear here once provided. Crypto contributions are unavailable until then.</p>'
    return '<div class="support-payment stack" id="support-payment" data-support-contributions><p class="type-label">Financial support</p><h2>Support the movement.</h2><p>Choose bank transfer or, when available, a crypto contribution. These are separate from the practical-support questionnaire below.</p><div class="card-grid">'+bank_card+'</article>'+crypto_card+'</article></div><p role="status" aria-live="polite" aria-atomic="true" data-copy-status></p><p class="type-small">This website displays contribution instructions only. It does not process transfers, verify payment or issue automatic receipts. For questions, email htafl@africamail.com. Do not include banking passwords or private wallet credentials in a message.</p></div>'

def image(key, base='', eager=False, cls='', caption=True, modal=False):
    p=photos[key];v=p['variants'][2]
    if key=='artists-collaboration':cls=(cls+' photo--shared-sketches').strip()
    tag=f'<img class="{cls}" src="{base}{v["path"]}" srcset="'+', '.join(f'{base}{x["path"]} {x["width"]}w' for x in p['variants'][:3])+f'" sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 70vw, 50vw" width="{v["width"]}" height="{v["height"]}" alt="{escape(p["altSuggestion"])}" loading="{"eager" if eager else "lazy"}" decoding="async"'+(' fetchpriority="high"' if eager else '')+'>'
    if not caption:return tag
    if modal:tag=f'<button class="photo-button" type="button" data-photo-view aria-label="View {key.replace("-"," ")} photograph">{tag}</button>'
    return f'<figure class="editorial-photo" data-reveal>{tag}<figcaption>Illustrative photography / {escape(p["creator"])} · Pexels</figcaption></figure>'

def heading(kicker,title,copy='',h='h2'):
    return f'<div class="section-heading"><p class="type-label">{kicker}</p><{h}>{title.replace(chr(10),"<br>")}</{h}>'+ (f'<p class="type-body-lg">{copy}</p>' if copy else '')+'</div>'

def button(text,href,secondary=False):
    return f'<a class="button button--{"secondary" if secondary else "primary"}" href="{href}">{text}</a>'

def link(text,href):return f'<a class="text-link" href="{href}">{text}</a>'
def research_citation(copy,phrase,url,source):
    before,after=copy.split(phrase,1)
    return escape(before)+f'<a href="{escape(url)}" target="_blank" rel="noopener noreferrer" title="{escape(source)} — opens in a new tab">{escape(phrase)}<span class="sr-only"> (opens in a new tab)</span></a>'+escape(after)
def section(content,cls='',id=''):
    return f'<section class="section {cls}"'+(f' id="{id}"' if id else '')+f'><div class="container">{content}</div></section>'
def opening(kicker,title,copy):return section(heading(kicker,title,copy,'h1'),'page-opening')
def invite(base):return section(heading('Begin where you are','You don’t have to have everything figured out to begin.','Create something. Move a little. Tell your story. Encourage someone. Try again.')+button('Join HTAFL',base+'get-involved/'),'surface surface--ink invitation')

prompts=[dict(id='redesign-something-old',title='Redesign something old.',description='Give an existing object or garment a fresh perspective.',category='create',photo='sewing',steps=['Choose something you already own.','Sketch a small change before working on the item.','Try a low-risk change. Ask for help with unfamiliar tools.']),dict(id='an-image-of-strength',title='Create an image representing strength.',description='Use line, shape or texture to express what strength means to you.',category='create',photo='sketchbook',steps=['Choose a shape, word or texture that suggests strength to you.','Make a small sketch. It can stay unfinished.','Notice what you would keep, change or explore next.']),dict(id='offer-encouragement',title='Encourage someone in your community.',description='Choose a small, thoughtful way to offer encouragement.',category='connect',photo='workshop',steps=['Think of someone who might appreciate encouragement.','Ask whether they would welcome a message or creative gesture.','Keep the gesture respectful. You do not need to share it publicly.'])]
def prompt_cards(items,base='',home=False):
    return '<div class="card-grid">'+''.join(f'<article class="card resource-card" data-reveal>'+image('sewing' if home else q['photo'],base,caption=False)+f'<div class="card__body"><p class="type-label">{q["category"].upper()} / SELF-GUIDED</p><h3>{q["title"]}</h3><p>{q["description"]}</p></div><a class="card__cta" href="{base}resources/{q["id"]}/">Explore prompt</a></article>' for q in items)+'</div>'

def scene(base='',full=False):
    descriptions=[('create','Expression<br>into possibility.','Explore expression through material, image, personal style and everyday creative practice.','design-board','textiles','Explore Create',base+'create/'),('overcome','Move. Reflect.<br>Reset. Try again.','Explore small, adaptable practices at your own pace. Participation can be quiet, private and entirely your own.','walking','design-board','Explore practices',base+'resources/?category=movement'),('connect','You don’t have<br>to grow alone.','Different stories. Shared strength. Listen, share an idea, or offer encouragement.','workshop','walking','Become Part of HTAFL',base+'get-involved/')]
    s='<div data-scenes>'+('<div class="section-heading"><p class="type-label">Enter the HTAFL world</p><h1>Create. Overcome. Connect.</h1><p>Three connected ways to express yourself, practice resilience and find connection.</p></div>' if full else heading('Enter the HTAFL world','Create. Overcome. Connect.','Three connected ways to express yourself, practice resilience and find connection.'))
    s+='<div class="scene-tabs" role="tablist" aria-label="Explore the HTAFL worlds">'+''.join(f'<button type="button" role="tab" id="tab-{key}" aria-controls="world-stage" aria-selected="{"true" if i==0 else "false"}" tabindex="{0 if i==0 else -1}" data-scene="{key}">{key.capitalize()}</button>' for i,(key,*_) in enumerate(descriptions))+'</div>'
    s+='<div class="scene-stage" id="world-stage" role="tabpanel" aria-labelledby="tab-create" tabindex="0"><svg class="scene-lines" viewBox="0 0 800 550" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M80 30 330 260 755 55M330 260 730 475M330 260 190 520M330 260 420 0M330 260 5 310"/></g></svg>'
    for i,(key,title,copy,photo,detail,cta,href) in enumerate(descriptions):
        vis=' data-world-visible' if i==0 else ''
        s+=f'<div class="scene-copy stack" data-world="{key}"{vis}><img class="scene-symbol" src="{base}assets/htafl-wordmark.svg" alt="" width="120" height="120"><h{"2" if full else "3"}>{title}</h{"2" if full else "3"}><p>{copy}</p><div class="cluster">{button(cta,href)}'+link('Skip the experience',base+'index.html#experience')+'</div></div>'
        s+=image(photo,base,cls='scene-photo',caption=False).replace('<img ',f'<img data-world="{key}"{vis} data-depth="0.35" ',1)
        s+=image(detail,base,cls='scene-detail',caption=False).replace('<img ',f'<img data-world="{key}"{vis} data-depth="0.65" ',1)
    s+='</div>'
    if not full:s+='<div class="cluster">'+button('Explore the experience',base+'immersive/')+link('Skip to creative practice','#creative-practice')+'</div>'
    return s+'</div>'

def form(kind,pathway=None,base='../'):
    upload=kind=='artwork';prefix='artwork' if upload else 'involvement'+('-'+pathway if pathway else '')
    action='/api/community/submissions' if upload else '/api/involvement'
    s=f'<form class="form-shell" id="{prefix}-contact" method="post" action="{action}" data-api-form="{kind}"'+(' enctype="multipart/form-data"' if upload else '')+f' aria-describedby="{prefix}-notice"><p class="form-notice" id="{prefix}-notice" data-form-notice>Checking submission availability… You can also contact <a href="mailto:htafl@africamail.com">htafl@africamail.com</a>.</p><noscript><p>Online forms need JavaScript. Please email htafl@africamail.com directly.</p></noscript><div class="form-errors stack" tabindex="-1" data-form-errors role="group" aria-labelledby="{prefix}-errors-title" hidden><h3 id="{prefix}-errors-title">Please check your details</h3><ul></ul></div><fieldset class="form-fields" disabled><legend class="sr-only">'+('Share your work' if upload else 'Your involvement enquiry')+'</legend>'
    fields=[('credit','Creator credit','text',100,1),('email','Email (private)','email',254,3),('title','Title of your work','text',120,1),('category','Creative category','select',0,0),('description','Tell us about your work','textarea',1000,20),('alt','Describe what is visible in the image','textarea',300,10)] if upload else []
    if pathway:
        fields=[(f['name'],f['label'],f['type'],f.get('max',0),f.get('min',0)) for f in involvement_pathways[pathway]['fields']]
        s+=f'<input type="hidden" id="{prefix}-interest" name="interest" value="{pathway}">'
    s+='<p class="type-small">Online forms are for adults aged 18 or over. For a child’s involvement, a parent or legal guardian must <a href="mailto:htafl@africamail.com">contact the Operations Manager first</a>. Please do not send a child’s personal details or identifiable images through this form.</p>'
    for name,label,type,maxlen,minlen in fields:
        id=f'{prefix}-{name}';req=' required' if minlen>0 or type=='select' else ''
        s+=f'<div class="field"><label class="field__label" for="{id}">{label}</label>'
        if type=='select':
            if pathway:
                spec=next(f for f in involvement_pathways[pathway]['fields'] if f['name']==name)
                req=' required' if spec['required'] else ''
                opts=spec['options']
            else:opts=[(n.lower(),n) for n in ['Art','Fashion','Illustration','Upcycling','Photography']];req=' required'
            s+=f'<select class="field__control" id="{id}" name="{name}"{req} aria-describedby="{id}-error"><option value="">Choose an option</option>'+''.join(f'<option value="{value}">{escape(n)}</option>' for value,n in opts)+'</select>'
        elif type=='textarea':s+=f'<textarea class="field__control" id="{id}" name="{name}" rows="{6 if name in ["message","description"] else 3}" minlength="{minlen}" maxlength="{maxlen}"{req} aria-describedby="{id}-error"></textarea>'
        else:s+=f'<input class="field__control" id="{id}" name="{name}" type="{type}" maxlength="{maxlen}"'+(' autocomplete="email"' if type=='email' else ' autocomplete="name"' if name=='name' else '')+f'{req} aria-describedby="{id}-error">'
        s+=f'<p class="field__error type-small" id="{id}-error" hidden></p></div>'
    if upload:
        s+=f'<div class="upload-zone"><label class="field__label" for="{prefix}-artwork">Upload your work</label><p class="type-small">One still JPEG, PNG or WebP, up to <span data-upload-limit>3 MB</span>. We remove embedded metadata and keep your upload private during review.</p><input id="{prefix}-artwork" type="file" name="artwork" accept="image/jpeg,image/png,image/webp" required aria-describedby="{prefix}-artwork-error"><p id="{prefix}-artwork-error" class="field__error type-small" hidden></p><img class="upload-preview" data-upload-preview hidden alt="Preview of your selected work"></div>'
        consents=[('rightsConsent','I created this work, have the right to share it, and have permission from any identifiable people shown.',True),('contactConsent','I agree that HTAFL may store my submission privately and use my email to contact me about its review.',True),('publicationConsent','HTAFL may display this work, title, description and creator credit publicly after review. My email stays private. (optional)',False)]
    else:consents=[('consent','I agree that HTAFL may use these details to respond to my enquiry.',True)]
    consents.insert(0,('adultConsent','I am 18 or over, and this submission contains no child’s personal information or identifiable images.',True))
    s+='<p class="type-small">'+('Your email is private. Submitting does not guarantee publication. You can request withdrawal at htafl@africamail.com.' if upload else 'Please avoid private health details. Message: 20–2000 characters.')+'</p>'
    for name,label,req in consents:
        id=f'{prefix}-{name}'
        s+=f'<div class="field"><label class="consent-choice" for="{id}"><input id="{id}" name="{name}" type="checkbox"'+(' required' if req else '')+f' aria-describedby="{id}-error"><span>{label}</span></label><p class="field__error type-small" id="{id}-error" hidden></p></div>'
    submit_label='Submit for review' if upload else involvement_pathways[pathway]['submit'] if pathway else 'Send enquiry'
    s+=f'<div class="honeypot" aria-hidden="true"><label for="{prefix}-website">Leave this empty</label><input id="{prefix}-website" name="website" tabindex="-1" autocomplete="off"></div>'+link('Privacy Notice',base+'privacy/')+f'<div class="cluster"><button class="button button--primary" type="submit" data-submit>{submit_label}</button><button class="button button--secondary" type="reset">Clear form</button></div></fieldset><p data-form-status role="status" aria-live="polite" aria-atomic="true"></p></form>'
    return s

def write(route,title,description,body,extra=()):
    base='' if route=='' else '../' * len(route.split('/'))
    scripts=['site-shell.js','editorial.js']+list(extra)
    fallback_nav='<nav class="site-nav site-nav--desktop" aria-label="Primary"><ul>'+''.join(f'<li><a href="{base}{path}/">{name}</a></li>' for path,name in [('about','About'),('how-it-works','How It Works'),('create','Create'),('community','Community'),('resources','Resources'),('merchandise','Merchandise'),('get-involved','Get Involved')])+'</ul></nav>'
    html=f'''<!doctype html>
<html lang="en" class="has-site-shell"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title}</title><meta name="description" content="{escape(description)}"><meta name="theme-color" content="#101A33"><link rel="icon" href="{base}assets/htafl-favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{base}main.css">'''+''.join(f'<script src="{base}scripts/{s}" defer></script>' for s in scripts)+f'''</head><body class="page fashion-site" data-page="{escape(route.split('/')[0] or 'home')}"><a class="skip-link" href="#main">Skip to content</a><site-header><header class="site-header"><div class="container site-header__bar"><a class="site-logo" href="{base}index.html"><img src="{base}assets/htafl-wordmark.svg" width="150" height="40" alt="HTAFL"></a>{fallback_nav}</div></header></site-header><main id="main" tabindex="-1">{body}</main><site-footer><footer class="container section"><p>© 2026 HTAFL. All rights reserved.</p><a href="mailto:htafl@africamail.com">htafl@africamail.com</a></footer></site-footer><dialog class="media-dialog" data-media-dialog aria-labelledby="media-title"><header><h2 id="media-title">Process, in detail.</h2><button class="button button--secondary" type="button" data-media-close>Close</button></header><img data-media-image alt=""><p class="type-small" data-media-note>Illustrative process photography, not an HTAFL community submission.</p></dialog></body></html>'''
    html=html.replace('><','>\n<')
    dest=ROOT/route/'index.html';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html,encoding='utf-8')

# Current homepage: one entrance per pathway, with details on destination pages.
hero='<div class="hero-editorial"><div class="hero-copy stack"><p class="type-label">Hope / Talent / Art / Fashion / Life</p><h1>Fashion<br>Meets Healing.</h1><p>Art, fashion and creative spaces for young people to express their authentic selves, build resilience and find connection.</p><p class="type-label">Create. Overcome. Connect.</p></div><div class="hero-atelier">'+image('pattern-studio',eager=True,caption=False).replace('<img ','<img data-depth="0.4" ',1)+'<figure class="fashion-cloth" data-fashion-cloth aria-label="An interactive study of draped textile"><div class="cloth-fallback" aria-hidden="true"></div><figcaption>Material study / draped textile</figcaption></figure><p class="hero-caption">ILLUSTRATIVE ATELIER / '+escape(photos['pattern-studio']['creator'].upper())+'</p></div></div>'
home=section(hero,'hero-section')
worlds=[('Create','Art. Fashion. Your expression.','atelier-collaboration','create/'),('Overcome','Move. Reflect. Try again.','progress-staircase','overcome/'),('Connect','Make things. Make connections.','artists-collaboration','community/')]
home+=section(heading('Choose your way in','Room for your expression.')+'<div class="world-links">'+''.join('<a class="world-link" href="'+href+'" data-world-link="'+name.lower()+'">'+image(key,caption=False)+f'<span class="world-link__copy"><span class="type-label">{copy}</span><span class="world-link__title">{name}</span></span></a>' for name,copy,key,href in worlds)+'</div><p class="type-small world-caption">Illustrative photography. People shown are not HTAFL members or community submissions.</p>','surface surface--ink',id='experience')
home+=section('<div class="editorial-split">'+image('sketchbook',modal=True)+'<div class="stack" data-reveal>'+heading('Why HTAFL exists','Perhaps sometimes<br>we have to make hope.','The idea began in a hostel room. A song, the need to be understood, and a child’s drawing helped shape what HTAFL would become.')+'<blockquote>You do not have to be good at creating something for what you create to mean something.</blockquote>'+link('Explore why HTAFL exists','about/#founder-story')+'</div></div>')
research_phrases={'bullying':'UNESCO','mental-health':'WHO','arts':'WHO’s 2019 scoping review'}
home+=section(heading('Research / context','Expression and belonging matter.')+'<div class="evidence-grid">'+''.join('<article class="evidence-card stack" data-reveal><p class="evidence-value">'+item['value']+'</p><h3>'+item['title']+'</h3><p>'+research_citation(item['copy'],research_phrases[item['id']],item['url'],item['source'])+'</p></article>' for item in research['sources'])+'</div><p class="evidence-note">'+research['interpretation']+'</p><div class="evidence-note stack"><h3>'+research['fashionEvidence']['title']+'</h3><p>'+research_citation(research['fashionEvidence']['copy'],'2025 study',research['fashionEvidence']['url'],research['fashionEvidence']['source'])+'</p></div>','evidence-section',id='research')
home+=section(heading('Collaboration','Partner With HTAFL',landing_copy['partner'])+button('Partner With HTAFL','get-involved/collaborate/#involvement-form'),'surface surface--ink partnership')
write('','HTAFL — Fashion Meets Healing','Hope. Talent. Art. Fashion. Life. Explore art, fashion, resilience and community with HTAFL.',home,['fashion-cloth.js'])

about=opening('The founder’s story','Why HTAFL exists.','The story behind Hope. Talent. Art. Fashion. Life.')
about+=section('<article class="stack founder-story reading-page" aria-label="HTAFL founder story">'+''.join('<p>'+escape(p)+'</p>' for p in founder_paragraphs)+'</article>',id='founder-story')
about+=section(heading('Our mission','Fashion Meets Healing',landing_copy['mission']))
about+=section(heading('Our vision','Room to become yourself.','A world where every young person can grow free from hate, feel a sense of belonging and build confidence in their identity and creative potential.')+link('See How It Works','../how-it-works/'))
write('about','The Founder’s Story — HTAFL','Read the personal story behind HTAFL and its mission of expression, confidence and belonging.',about)

areas=[('Creative Experiences','Try illustration, styling, photography or upcycling.','An idea and materials you already have.','create','sketchbook'),('Resilience Practices','Make space for movement, reflection or resetting.','A comfortable option that works for you.','overcome','walking'),('Community Experiences','Share an idea, collaborate or offer encouragement.','A willingness to listen and respect others’ choices.','community','workshop'),('Learning & Resources','Explore practical prompts and reviewed material.','Curiosity; no social account is required.','resources','design-board')]
how=opening('How it works','Begin with a small action.','Explore a practice that fits your interests, your access needs and your own pace.')
how+=section(''.join('<article class="area-row" data-reveal>'+image(key,'../',caption=False)+f'<details open><summary><h2>{n}</h2><span aria-hidden="true">+</span></summary><div class="stack"><p class="type-body-lg">{c}</p><p class="type-label">What you need</p><p>{need}</p>'+link('Explore '+route,'../'+route+'/')+'</div></details></article>' for n,c,need,route,key in areas))
how+=section(heading('At your own pace','Choose an interest. Explore a practice. Start a conversation.','Self-guided prompts are a starting point. An inquiry expresses interest; it does not create membership or book an event.')+button('Ask About Participating','../get-involved/participate/#involvement-form'))
how+=section(heading('Common questions','Room for your questions.')+''.join(f'<details class="faq"><summary>{a}</summary><p>{b}</p></details>' for a,b in [('Do I need experience?','No. Choose a small starting point and work with what you have.'),('Can I adapt the practices?','Yes. You can skip, simplify, participate privately or choose another option.'),('Can I book a workshop?','Service availability must be confirmed with HTAFL. Use an inquiry to express interest.')]))
write('how-it-works','How It Works — HTAFL','Explore creative experiences, resilience practices, community experiences and learning resources.',how)

create=opening('Create / Art & fashion','Art doesn’t have to be perfect to matter.','Explore expression through material, image, personal style and everyday creative practice.')
create+=section('<div class="atelier-pair">'+image('atelier-collaboration','../',modal=True)+image('sewing','../',modal=True)+'</div>')
disciplines=[('Art & Illustration','Sketch, draw or build a mood board from your own visual references.'),('Fashion & Personal Style','Explore silhouettes, color and your visual identity.'),('Upcycling','Rework something you already own. Begin with a small change.'),('Photography','Notice light, texture or a detail you might normally pass by.'),('Design','Arrange materials, imagery and type to communicate an idea.'),('Creative Reflection','Use making to notice and express your own perspective.')]
create+=section(heading('Creative Expression','The why behind making.',landing_copy['creativeExpression'])+heading('Fashion Forward','Individuality, skill and confidence.',landing_copy['fashionForward']))
create+=section(heading('Choose your medium','Make something that feels like you.')+'<ul class="discipline-list">'+''.join(f'<li data-reveal><h3>{n}</h3><p>{c}</p></li>' for n,c in disciplines)+'</ul>')
create+=section(heading('Begin with what you have','A small invitation to make.')+prompt_cards(prompts[:2],'../'))
create+=section(heading('Shared creativity','Your work could start a conversation.','Share a work in progress, an illustration or a fashion project. Submissions stay private until review, and only appear publicly with your permission.')+button('Share your work','../community/#share-work'))
write('create','Create — HTAFL','Explore illustration, upcycling, textiles, photography and personal style. Make something that feels like you.',create)

merchandise=opening('Wear the idea','HTAFL\nMerchandise.','Art. Fashion. Identity. Create. Overcome. Connect.')
merchandise+=section('<div class="editorial-split">'+image('atelier-collaboration','../')+'<div class="stack empty-state" data-reveal>'+heading('Merchandise','Coming soon.','HTAFL merchandise is not available to purchase yet. Product details and an official purchase link will appear here when ready.')+'<p class="type-small">The atelier photograph is illustrative, not an HTAFL product.</p>'+button('Explore creative practice','../create/')+'</div></div>','merchandise-feature')
write('merchandise','Merchandise — HTAFL','HTAFL merchandise is coming soon. Find future product releases and the official purchase pathway here.',merchandise)

community=opening('Connect / Community','Different stories.\nShared strength.','Creativity can connect us. Find a way to share, collaborate, participate or offer encouragement.')
community+=section(heading('Safe Spaces','Room to be your authentic self.',landing_copy['safeSpaces']))
community+=section(image('artists-collaboration','../',modal=True))
community+=section('<ul class="discipline-list participation-rows">'+''.join(f'<li data-reveal><h2>{n}</h2><div class="stack"><p>{c}</p>'+('' if n=='Share' else link('Explore '+n.lower(),'../get-involved/'+state.lower()+'/#involvement-form'))+'</div></li>' for n,c,state in [('Collaborate','Bring an idea, shared space or creative practice.','Collaborate'),('Share','Share your art or fashion work. Public features require specific consent.','Create'),('Support','Offer encouragement or ask how your skills could help.','Support'),('Participate','Explore a self-guided prompt, or ask about opportunities.','Participate')])+'</ul>')
community+=section(heading('How we show up','Respect. Choice. Consent. Inclusion.','Listen without judgement. Respect someone’s choice to stay private or step back. Ask before sharing a person’s words, image or work. Make room for different abilities and experiences.')+link('Read community guidelines','../community-guidelines/'))
community+=section(heading('Made by the community','Featured community work.','Art, fashion and creative experiments shared with permission. The latest approved uploads appear here with their creator credits.')+'<p role="status" data-gallery-status aria-live="polite" aria-atomic="true"></p><div class="gallery-invitation stack" data-gallery-empty><h3>Your work could be the start.</h3><p>Share your art or fashion for private review. Work appears here only after approval and with permission to publish.</p>'+button('Submit your art or fashion','#share-work')+'</div><ul class="creative-gallery featured-community" id="featured-community-works" data-community-gallery data-gallery-limit="6" hidden aria-label="Featured community works"></ul><noscript><p>JavaScript is needed to load approved uploads. You can contact HTAFL at htafl@africamail.com to ask about sharing your work.</p></noscript>',id='gallery')
community+=section('<div class="form-columns"><div class="stack">'+heading('Your work. Your voice.','Share something you made.','Illustration, textiles, upcycling, photography or personal style. A finished piece or a work in progress.')+'<p>Your submission goes to private review. You decide whether HTAFL may publish it with your creator credit.</p><p>Do not upload someone else’s work or photos of people without their permission.</p></div>'+form('artwork')+'</div>',id='share-work')
write('community','Community — HTAFL','Share your art and fashion work for private review, collaborate, participate and connect with HTAFL.',community,['involvement-form.js','community-gallery.js'])

overcome=opening('Overcome / Resilience','Move. Reflect.<br>Reset. Try again.','Explore small, adaptable practices at your own pace. Participation can be quiet, private and entirely your own.')
overcome+=section(image('progress-staircase','../',modal=True))
overcome+=section(heading('At your own pace','Make room for a small beginning.')+'<ul class="values-list">'+''.join('<li><h2>'+name+'</h2><p>'+copy+'</p></li>' for name,copy in [('Movement','Choose a comfortable way to move, pause or spend time outdoors. Adapt it to your abilities and circumstances.'),('Reflection','Use writing, drawing or a quiet moment to notice your own experience. You choose what stays private.'),('Resilience','Trying again can be a small action. Rest, a new approach or reaching out can also be part of it.')])+'</ul>'+link('Explore available resources','../resources/'))
write('overcome','Overcome — HTAFL','Explore adaptable movement, reflection and resilience at your own pace.',overcome)


resource=opening('Resources','A little direction.\nRoom to explore.','Find practical starting points for creativity, movement and connection.')
library='<form id="resource-search" role="search" class="stack"><div class="field library-search"><label class="field__label" for="resource-query">Search resources</label><div class="search-controls"><input class="field__control" id="resource-query" type="search" name="q" maxlength="200" placeholder="Search by topic or keyword"><button class="button button--secondary" type="submit">Search</button></div></div><fieldset class="filter-group"><legend class="sr-only">Filter resources by category</legend><div class="cluster">'+''.join(f'<label class="filter-choice"><input type="radio" name="category" value="{value}"'+(' checked' if not value else '')+f'>{n}</label>' for value,n in [('', 'All'),('mind','Mind'),('movement','Movement'),('create','Create'),('connect','Connect'),('stories','Stories')])+'</div></fieldset></form><p id="resource-status" role="status" aria-live="polite" aria-atomic="true"></p><button class="button button--secondary" type="button" data-clear-resources hidden>Clear filters</button><ul class="card-grid card-grid--list" data-resource-list aria-label="Resources"></ul><div class="empty-state stack" data-resource-empty hidden><p class="type-label" data-empty-label>No results</p><h2 data-empty-title>No resources match your search.</h2><p data-empty-message>Try another word or clear the filters.</p></div><noscript><p>Search and filters need JavaScript. Explore the self-guided prompts below.</p>'+prompt_cards(prompts,'../')+'</noscript><template id="resource-card"><li class="card resource-card"><img data-resource-image loading="lazy" decoding="async" alt=""><div class="card__body"><p class="type-label" data-resource-category></p><h3><a data-resource-link class="text-link"></a></h3><p data-resource-description></p><p class="type-small" data-resource-source></p></div></li></template>'
records=[dict(id=q['id'],title=q['title'],description=q['description'],category=q['category'],status='published',source='HTAFL / Self-guided creative prompt',href=q['id']+'/',tags=[q['category'],'creative','prompt'],image=photos[q['photo']]['variants'][2]['path'],alt=photos[q['photo']]['altSuggestion']) for q in prompts]
library+='<script type="application/json" id="resource-data">'+json.dumps(records)+'</script>'
resource+=section('<div class="stack">'+library+'</div>')
write('resources','Resources — HTAFL','Search HTAFL’s self-guided creative prompts by keyword and category.',resource,['content-data.js','resource-library.js'])

for q in prompts:
    b=link('Resources / Self-guided prompts','../')+heading(q['category']+' / Self-guided prompt',q['title'],q['description'],'h1')+image(q['photo'],'../../',modal=True)
    b+='<h2>What you need</h2><p>'+('A thoughtful idea and a way to reach someone respectfully.' if q['category']=='connect' else 'Paper, a pencil, or an existing item and materials you already have.')+'</p><h2>Try this</h2><ul data-practice-steps>'+''.join(f'<li>{s}</li>' for s in q['steps'])+'</ul><h2>Make it your own</h2><p>You can simplify, adapt or keep this practice private. Pause or choose another starting point whenever you like.</p><h2>Optional reflection</h2><p>What did you notice while making or participating?</p><h2>Sources &amp; credits</h2><p>Original self-guided prompt from the supplied HTAFL master brief. Illustrative photo by '+photos[q['photo']]['creator']+' / Pexels. The photograph does not depict an HTAFL submission.</p>'+link('Explore another prompt','../')
    write('resources/'+q['id'],q['title']+' — HTAFL',q['description'],section('<div class="stack reading-page">'+b+'</div>'),['practice-checklist.js'])

involved=opening('Get involved','There’s a place\nfor your contribution.','Participate, create, volunteer, collaborate or support. Start with a conversation about how you would like to take part.')
pathways=[('Participate','Ask about experiences and ways to take part.'),('Create','Introduce your practice or share an idea.'),('Volunteer','Offer time and skills that fit your availability.'),('Collaborate','Propose a creative or community partnership.'),('Support','Offer practical help or make a financial contribution.')]
def pathway_nav(base='',active=None):
    return '<nav class="pathway-list" aria-label="Ways to get involved">'+''.join('<article><a class="text-link" href="'+base+n.lower()+'/" data-involvement-pathway="'+n.lower()+'"'+(' aria-current="page"' if active==n.lower() else '')+'>'+n+'</a><p>'+c+'</p></article>' for n,c in pathways if active!=n.lower())+'</nav>'
involved+=section(pathway_nav(),id='involvement-pathways')
write('get-involved','Get Involved — HTAFL','Choose a participation, creative, volunteer, collaboration or support pathway.',involved,['involvement-pathways.js'])
for n,c in pathways:
    key=n.lower();spec=involvement_pathways[key]
    extra=link('Upload art or fashion for private review','../../community/#share-work') if key=='create' else ''
    if key=='support':extra=contribution_options()
    panel='<div class="stack" id="involvement-form">'+extra+form('involvement',key,'../../')+'</div>'
    body=opening(n+' / Get involved',spec['title'],spec['description'])
    if key=='collaborate':body+=section(heading('Partner With HTAFL','Bring something we can build together.',landing_copy['partner']))
    body+=section('<div class="stack reading-page involvement-questionnaire">'+link('Choose a different way to get involved','../')+panel+'</div>')
    write('get-involved/'+key,n+' — Get Involved — HTAFL',spec['description'],body,['involvement-form.js']+(['support-payment.js'] if key=='support' else []))
write('credits','Credits — HTAFL','Photography, material and social-icon credits.',opening('Credits','The people behind the resources.','Licensed resources are used as illustration, not as HTAFL community submissions.')+section('<div class="stack reading-page"><h2>Photography</h2>'+''.join('<p>'+escape(x['creator'])+' / <a href="'+x['originalUrl']+'">'+escape(x['name'].replace('illustrative-','').replace('-',' '))+'</a> / Pexels License.</p>' for x in manifest['images'])+'<h2>Social icons</h2><p>Font Awesome Free 6.7.2 by Fonticons, Inc. / <a href="https://fontawesome.com/license/free">CC BY 4.0</a>. The individual Instagram, X and TikTok SVGs are unmodified; trademarks belong to their respective owners. Icons identify HTAFL’s own social profiles.</p><h2>Draped textile</h2><p>Sheen Cloth by Microsoft, distributed through the <a href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenCloth">Khronos glTF Sample Assets repository</a> under CC0 1.0. The mesh was resampled for the web; licensed material maps were resized and converted to WebP.</p><h2>Background textile</h2><p>Terlenka by <a href="https://polyhaven.com/a/terlenka">Poly Haven</a>: photography by colormass, processing by Rico Cilliers. <a href="https://polyhaven.com/license">CC0 1.0</a>. Only the diffuse image is used, resized and converted to WebP for the decorative website background.</p></div>'))
write('immersive','Enter the HTAFL World — HTAFL','Explore three editorial worlds: Create, Overcome and Connect.',section(scene('../',True),'surface surface--ink'))

policies={
 'privacy':('Privacy','Your work. Your choices.', privacy_policy['sections']),
 'accessibility':('Accessibility','A way in for everyone.', [('Using the site','Pages keep important copy in HTML. Navigation, category filters, image viewers and forms support keyboard interaction. You can skip to the main content, and controls have visible focus indicators.'),('Motion preferences','When your device asks for reduced motion, image parallax and entrance transforms are removed. No audio plays on this website.'),('Help and feedback','If a feature prevents you from participating, email htafl@africamail.com. Describe the page and what you were trying to do. You do not need to share a health condition or other sensitive details. This is not a claim of independent accessibility certification.')]),
 'community-guidelines':('Community guidelines','Respect. Choice. Consent. Inclusion.', [('Share your own work','Submit work you created or have permission to share. Credit collaborators. Ask before including an identifiable person, their words, or their work.'),('Keep participation respectful','Make room for different abilities, identities and experiences. Do not use submissions to harass, demean, reveal someone’s private information, or promote hate.'),('Review and publication','Submissions enter private review. Permission to publish is optional. HTAFL may decline work that does not fit these expectations. No approval or placement is guaranteed.'),('Your choice to step back','You can keep a practice private or decline publication. To withdraw a submission or report a concern, contact htafl@africamail.com with its reference or the page link.')])}
for route,(name,title,entries) in policies.items():
    content=heading(name,title,'','h1')+''.join(f'<h2>{a}</h2><p>{b}</p>' for a,b in entries)
    if route=='privacy':content+='<p class="type-small">Updated '+escape(privacy_policy['updated'])+'. This notice follows the storage-limitation principles of the <a href="https://ndpc.gov.ng/our-data-privacy-policy/" target="_blank" rel="noopener noreferrer">Nigeria Data Protection Commission<span class="sr-only"> (opens in a new tab)</span></a>.</p>'
    write(route,name+' — HTAFL',title,section('<div class="stack reading-page">'+content+'</div>'))

# The server uses the same shared shell for unknown routes.
write('not-found','Page Not Found — HTAFL','This page could not be found.',opening('Page not found','A different way forward.','The page may have moved. Explore HTAFL from the homepage.')+section(button('Return home','../index.html')))
notfound=(ROOT/'not-found/index.html').read_text(encoding='utf-8').replace('../assets/','/assets/').replace('../main.css','/main.css').replace('../scripts/','/scripts/').replace('../index.html','/index.html').replace('href="../','href="/')
(ROOT/'404.html').write_text(notfound,encoding='utf-8')

print('Authored homepage, supporting pages, three prompt details, community upload form and utility pages from the Figma design.')
