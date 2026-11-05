"""Copy the recovered site to the repository's Vercel static directory."""
import shutil
import json
from common import ROOT, SITE

def main():
    destination=ROOT.parent/'public'
    shutil.copytree(SITE/'sobremesas-de-travessa',destination/'sobremesas-de-travessa',dirs_exist_ok=True)
    (destination/'index.html').write_text('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/sobremesas-de-travessa/"><title>Sobremesas de Travessa para o Natal</title><a href="/sobremesas-de-travessa/">Abrir oferta recuperada</a></html>\n',encoding='utf-8')
    config_path=ROOT.parent/'vercel.json'
    config=json.loads(config_path.read_text(encoding='utf-8'))
    config['redirects']=[{'source':'/','destination':'/sobremesas-de-travessa/','permanent':False}]
    config['rewrites']=[{'source':'/sobremesas-de-travessa/:path*','destination':'/sobremesas-de-travessa/index.html'}]
    config_path.write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Prepared public/sobremesas-de-travessa and Vercel routing; not published.')

if __name__=='__main__':main()
