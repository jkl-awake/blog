document.addEventListener('DOMContentLoaded', () => {
  const homePosts = document.getElementById('recent-posts');
  const isHome = Boolean(homePosts);

  if (isHome && !document.querySelector('.timeline-home__hero')) {
    const intro = document.createElement('div');
    intro.className = 'timeline-home__intro';

    const hero = document.createElement('section');
    hero.className = 'card-widget timeline-home__hero';
    hero.innerHTML = `
      <div class="timeline-home__hero-copy">
        <p class="timeline-home__eyebrow">PERSONAL TIMELINE</p>
        <h1 class="timeline-home__title">时间褶皱</h1>
        <p class="timeline-home__desc">用文章记录项目、节点与变化，把个人网站整理成一条持续更新、可回看的时间线。</p>
      </div>
      <div class="timeline-home__hero-stats">
        <div class="timeline-home__stat">
          <span class="timeline-home__stat-value">${homePosts.querySelectorAll('.recent-post-item').length}</span>
          <span class="timeline-home__stat-label">篇最近记录</span>
        </div>
        <div class="timeline-home__stat">
          <span class="timeline-home__stat-value">3</span>
          <span class="timeline-home__stat-label">个自定义页面</span>
        </div>
        <div class="timeline-home__stat">
          <span class="timeline-home__stat-value">Docker</span>
          <span class="timeline-home__stat-label">静态部署形态</span>
        </div>
      </div>
    `;

    const nav = document.createElement('div');
    nav.className = 'timeline-home__nav';
    nav.innerHTML = `
      <a class="timeline-chip" href="/timeline/"><i class="fas fa-timeline"></i><span>查看完整时间线</span></a>
      <a class="timeline-chip" href="/projects/"><i class="fas fa-diagram-project"></i><span>浏览项目清单</span></a>
      <a class="timeline-chip" href="/now/"><i class="fas fa-bolt"></i><span>了解最近在做什么</span></a>
    `;

    intro.appendChild(hero);
    intro.appendChild(nav);

    const postList = homePosts.querySelector('.recent-post-items');
    homePosts.insertBefore(intro, postList);
    homePosts.classList.add('timeline-home-ready');
  }

  const items = document.querySelectorAll('.article-sort-item:not(.year), #recent-posts .recent-post-items > .recent-post-item, .tl-card, .timeline-feature, .timeline-chip');

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  items.forEach((item) => observer.observe(item));
});
