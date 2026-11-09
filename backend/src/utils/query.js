function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pagination(page, limit, total) {
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  return {
    total,
    page: safePage,
    limit: safeLimit,
    pages: Math.max(Math.ceil(total / safeLimit), 1),
  };
}

module.exports = { escapeRegex, pagination };
