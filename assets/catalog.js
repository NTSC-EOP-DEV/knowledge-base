/* 知识库目录：自动读取仓库文件树，失败时使用内置索引 */
(function () {
  var REPO = 'NTSC-EOP-DEV/knowledge-base';
  var BRANCH = 'main';
  var CACHE_KEY = 'kb-tree-v3';

  var CAT_NAMES = {
    physics: '物理',
    math: '数学',
    biology: '生物',
    chemistry: '化学',
    cs: '计算机',
    ai: '人工智能',
    humanities: '人文',
    history: '历史',
    notes: '笔记'
  };

  var FALLBACK = [
    { path: 'docs/physics/李政道-物理的挑战', title: '李政道《物理的挑战》', cat: '物理', ext: ['md', 'html'] }
  ];

  function qs(sel, root) { return (root || document).querySelector(sel); }

  function buildDocs(paths) {
    var map = {};
    paths.forEach(function (p) {
      var m = /^(docs\/[^/]+\/)(.+)\.(md|html)$/i.exec(p);
      if (!m) return;
      var base = m[1] + m[2];
      var ext = m[3].toLowerCase();
      if (!map[base]) {
        map[base] = {
          path: base,
          title: m[2].replace(/[-_]/g, ' · '),
          cat: CAT_NAMES[m[1].split('/')[1]] || m[1].split('/')[1],
          ext: []
        };
      }
      if (map[base].ext.indexOf(ext) < 0) map[base].ext.push(ext);
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  function render(docs, filter) {
    var list = qs('#catalog');
    var kw = (filter || '').trim().toLowerCase();
    var groups = {};
    var count = 0;

    docs.forEach(function (d) {
      var hay = (d.title + ' ' + d.path + ' ' + d.cat).toLowerCase();
      if (kw && hay.indexOf(kw) < 0) return;
      (groups[d.cat] = groups[d.cat] || []).push(d);
      count++;
    });

    var cats = Object.keys(groups).sort();
    var html = cats.map(function (cat) {
      var items = groups[cat].sort(function (a, b) { return a.title.localeCompare(b.title, 'zh'); });
      var rows = items.map(function (d) {
        var acts = '';
        if (d.ext.indexOf('html') >= 0) {
          acts += '<a class="btn" href="' + encodeURI(d.path) + '.html">网页版</a>';
        }
        if (d.ext.indexOf('md') >= 0) {
          acts += '<a class="btn ghost" href="viewer.html?doc=' + encodeURIComponent(d.path + '.md') + '">Markdown</a>';
        }
        return '<article class="entry">' +
          '<div><div class="title">' + d.title + '</div>' +
          '<div class="path">' + d.path + '</div></div>' +
          '<div class="acts">' + acts + '</div>' +
          '</article>';
      }).join('');
      return '<section class="group"><div class="group-head"><h2>' + cat + '</h2>' +
        '<span>' + items.length + ' 篇</span></div>' + rows + '</section>';
    }).join('');

    list.innerHTML = html || '<div class="empty" style="display:block">没有匹配的内容</div>';
    var statDocs = qs('#stat-docs'), statCats = qs('#stat-cats');
    if (statDocs) statDocs.textContent = String(count);
    if (statCats) statCats.textContent = String(cats.length);
  }

  function fail() {
    render(FALLBACK, '');
    var hint = qs('#hint');
    if (hint) hint.textContent = '（当前无法读取仓库文件树，展示内置索引）';
  }

  function init() {
    var input = qs('#q');
    var docs = FALLBACK.map(function (d) { return d; });

    render(docs, '');

    var cached = null;
    try { cached = sessionStorage.getItem(CACHE_KEY); } catch (e) {}
    if (cached) {
      try {
        var paths = JSON.parse(cached);
        var parsed = buildDocs(paths);
        if (parsed.length) { docs = parsed; render(docs, input ? input.value : ''); }
        else fail();
      } catch (e) { fail(); }
    } else {
      fetch('https://api.github.com/repos/' + REPO + '/git/trees/' + BRANCH + '?recursive=1', {
        headers: { Accept: 'application/vnd.github+json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('tree ' + r.status);
        return r.json();
      }).then(function (data) {
        var paths = (data.tree || []).filter(function (t) { return t.type === 'blob'; }).map(function (t) { return t.path; });
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(paths)); } catch (e) {}
        var parsed = buildDocs(paths);
        if (parsed.length) { docs = parsed; render(docs, input ? input.value : ''); }
        else fail();
      }).catch(fail);
    }

    if (input) {
      input.addEventListener('input', function () { render(docs, input.value); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
