// 等待 DOM 完全載入後再綁定事件
document.addEventListener('DOMContentLoaded', function () {

  // 取得 header 的高度（用來計算滾動偏移）
  function getHeaderOffset() {
    var header = document.querySelector('header');
    return header ? header.offsetHeight : 0;
  }

  // 平滑滾動到指定元素，並補償 header 的高度
  function scrollToElementWithOffset(el) {
    if (!el) return;
    var headerOffset = getHeaderOffset();
    // 計算要滾動到的位置：元件到畫面頂端的位置 + 當前捲動值 - header 高度，再減一點間距 (12px)
    var y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // 處理所有以 # 開頭的連結（內頁錨點）
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var href = link.getAttribute('href');
    // 忽略空 href 或僅為 '#' 的連結（不做處理）
    if (!href || href === '#') return;

    // 若連結有 disabled 類別，阻止行為（這是用來標示「尚不可用」的按鈕）
    if (link.classList.contains('disabled')) {
      link.addEventListener('click', function (e) { e.preventDefault(); });
      return;
    }

    // 正式攔截錨點點擊，改用自訂的平滑滾動與偏移處理
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1); // 取得 # 後面的 id
      var target = document.getElementById(targetId);

      if (target) {
        e.preventDefault(); // 取消預設跳轉
        scrollToElementWithOffset(target); // 使用補償 header 的平滑滾動

        // 更新瀏覽器 URL 的 hash，但不會造成跳轉跳躍（使用 history API）
        if (history && history.pushState) {
          history.pushState(null, '', '#' + targetId);
        }
      }
    });
  });

  // 若頁面載入時 URL 已帶有 hash，則在載入後自動滾動到該元素（同樣補償 header）
  if (window.location.hash) {
    var id = window.location.hash.slice(1);
    var el = document.getElementById(id);
    if (el) setTimeout(function () { scrollToElementWithOffset(el); }, 60);
  }

  // Footer 的 Contact 按鈕行為：
  // 若 href 為空或 '#'，則阻止預設行為（避免跳到頁首）；
  // 若 href 是 mailto: 等真實連結，則保留預設行為以開啟郵件程式或其他動作。
  var footerContact = document.querySelector('.contact .contact-btn');
  if (footerContact) {
    var fHref = footerContact.getAttribute('href');
    if (!fHref || fHref === '#') {
      footerContact.addEventListener('click', function (e) {
        e.preventDefault();
      });
    }
    // 若 footer 使用 mailto:，不會阻擋，使用者可以正常開啟郵件客戶端
  }

});
