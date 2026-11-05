"""Capture source or local mirror; local QA never contacts external services."""
import argparse
import json
import os
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from common import ROOT, SOURCE

def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--live',action='store_true'); args=parser.parse_args()
    folder=ROOT/('capture_live' if args.live else 'capture_local');folder.mkdir(exist_ok=True)
    url=SOURCE if args.live else 'http://127.0.0.1:8765/sobremesas-de-travessa/'
    requests=[]; errors=[]; failures=[]; responses=[]; blocked=[]
    browser_root=Path('C:/Users/gui22/AppData/Local/ms-playwright')
    os.environ['PLAYWRIGHT_BROWSERS_PATH']=str(browser_root)
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        context=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1,service_workers='block')
        def route_request(route):
            req=route.request
            host=urlsplit(req.url).netloc
            if not args.live and host not in ('127.0.0.1:8765',):
                blocked.append({'url':req.url,'method':req.method,'type':req.resource_type});route.fulfill(status=204,body='');return
            if req.method not in ('GET','HEAD'):
                blocked.append({'url':req.url,'method':req.method,'type':req.resource_type});route.fulfill(status=204,body='');return
            route.continue_()
        context.route('**/*',route_request)
        page=context.new_page()
        page.on('request',lambda r: requests.append({'url':r.url,'method':r.method,'type':r.resource_type}))
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('requestfailed',lambda r:failures.append({'url':r.url,'failure':r.failure}))
        page.on('response',lambda r:responses.append({'url':r.url,'status':r.status}))
        page.goto(url,wait_until='networkidle',timeout=60000)
        page.wait_for_timeout(2000)
        # Scroll to trigger lazy-loaded images and reveal all landing-page sections.
        for _ in range(16):
            page.mouse.wheel(0,900);page.wait_for_timeout(200)
        page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(500)
        if not args.live:
            page.locator('img').evaluate_all('(els)=>els.forEach(e=>e.loading="eager")')
            page.evaluate('Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>null)))')
        page.screenshot(path=str(folder/'desktop.png'),full_page=True)
        (folder/'page.html').write_text(page.content(),encoding='utf-8')
        (folder/'text.txt').write_text(page.locator('body').inner_text(),encoding='utf-8')
        links=page.locator('a').evaluate_all('(els)=>els.map(e=>({text:e.innerText,href:e.href}))')
        buttons=page.locator('button').evaluate_all('(els)=>els.map(e=>({text:e.innerText,expanded:e.getAttribute("aria-expanded")}))')
        images=page.locator('img').evaluate_all('(els)=>els.map(e=>({src:e.currentSrc||e.src,complete:e.complete,width:e.naturalWidth}))')
        interactions=[]
        if not args.live:
            page.get_by_role('button',name='Pausar',exact=True).click()
            for index in range(10):
                button=page.locator('.preview-card:not([aria-hidden="true"]) button').nth(index)
                button.click(force=True)
                dialog=page.get_by_role('dialog')
                dialog.wait_for(state='visible')
                page.wait_for_timeout(300)
                interactions.append({'lightbox':index,'images':dialog.locator('img').evaluate_all('(els)=>els.map(e=>({src:e.currentSrc||e.src,width:e.naturalWidth}))')})
                if index==0:page.screenshot(path=str(folder/'lightbox.png'))
                page.get_by_role('button',name='Fechar',exact=True).click()
            page.get_by_role('link',name='QUERO O PLANO BÁSICO').click()
            dialog=page.get_by_role('dialog');dialog.wait_for(state='visible')
            interactions.append({'upgrade':dialog.inner_text(),'links':dialog.locator('a').evaluate_all('(els)=>els.map(e=>({text:e.innerText,href:e.href}))')})
            page.screenshot(path=str(folder/'upgrade.png'))
            page.get_by_role('button',name='Fechar',exact=True).click()
            # Only benign native FAQ disclosures; never click checkout links.
            for summary in page.locator('details > summary').all():
                summary.click();interactions.append({'faq':summary.inner_text(),'opened':summary.locator('..').get_attribute('open') is not None})
            page.set_viewport_size({'width':390,'height':844});page.goto(url,wait_until='networkidle')
            for _ in range(20):page.mouse.wheel(0,800);page.wait_for_timeout(100)
            page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(300)
            page.screenshot(path=str(folder/'mobile.png'),full_page=True)
            page.screenshot(path=str(folder/'mobile-top.png'))
            overflow=page.evaluate('({viewport:innerWidth,document:document.documentElement.scrollWidth})')
            response=page.goto(url+'preview/route',wait_until='networkidle')
            interactions.append({'deep_route':page.url,'status':response.status,'server':response.headers.get('x-recovery-server')})
        else: overflow=None
        report={'url':url,'errors':errors,'failures':failures,'bad_responses':[r for r in responses if r['status']>=400],'blocked':blocked,'links':links,'buttons':buttons,'images':images,'interactions':interactions,'mobile_width':overflow}
        for name,data in [('network',requests),('report',report)]: (folder/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
        print(json.dumps({'requests':len(requests),'errors':errors,'failures':failures,'bad_responses':report['bad_responses'],'images':len(images),'broken_images':[i for i in images if not i['width']],'buttons':buttons,'mobile_width':overflow},ensure_ascii=False,indent=2))
        browser.close()

if __name__=='__main__':main()
