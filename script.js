/* 沈言 · 产品设计师 — 交互脚本
   所有增强功能都是可选的：脚本失效时页面内容与导航仍然完整可用。 */

(() => {
  'use strict';

  /* ---- 本地时间（上海） ---- */
  const clockEl = document.querySelector('[data-clock]');

  if (clockEl) {
    try {
      const formatter = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const tick = () => {
        clockEl.textContent = formatter.format(new Date());
      };
      tick();
      window.setInterval(tick, 1000);
    } catch (error) {
      clockEl.textContent = '—';
    }
  }

  /* ---- 导航高亮 ---- */
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    let scheduled = false;

    const updateCurrent = () => {
      scheduled = false;
      const threshold = window.scrollY + 140;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 12;

      let current = null;
      for (const section of sections) {
        if (section.offsetTop <= threshold) current = section;
      }
      if (atBottom) current = sections[sections.length - 1];

      navLinks.forEach((link) => {
        if (current && link.getAttribute('href') === `#${current.id}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateCurrent);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateCurrent();
  }

  /* ---- 复制邮箱 ---- */
  const copyButton = document.querySelector('[data-copy]');
  const copyStatus = document.getElementById('copy-status');

  if (copyButton && copyStatus) {
    const label = copyButton.textContent;
    let resetTimer = 0;

    const legacyCopy = (text) => {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand('copy');
      field.remove();
      return ok;
    };

    copyButton.addEventListener('click', async () => {
      const value = copyButton.dataset.copy || '';
      let copied = false;

      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch (error) {
        copied = legacyCopy(value);
      }

      copyButton.textContent = copied ? '已复制' : '复制失败';
      copyStatus.textContent = copied
        ? '邮箱已复制到剪贴板'
        : '复制失败，请手动选择邮箱地址';

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        copyButton.textContent = label;
      }, 2200);
    });
  }

  /* ---- 年份 ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
