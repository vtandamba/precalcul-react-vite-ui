export function calculatePrecalculatedData(rules, links) {
    const kvData = {};
  
    for (const rule of rules) {
      if (!rule.support_url_pattern) continue;
  
      const relevantLinks = links
        .filter(link => {
          const isCorrectCategory = !rule.ancestor_categ_id || link.parent_link_id === rule.ancestor_categ_id;
          const levelMin = rule.start_level;
          const levelMax = rule.auth_depth ? rule.start_level + rule.auth_depth : rule.start_level;
          const isWithinLevelRange = link.level_number >= levelMin && link.level_number <= levelMax;
          const isAboveMinScore = !rule.score_min || link.score >= rule.score_min;
          return isCorrectCategory && isWithinLevelRange && isAboveMinScore;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, rule.max_links_number || Infinity);
  
      if (relevantLinks.length > 0) {
        if (!kvData[rule.support_url_pattern]) {
          kvData[rule.support_url_pattern] = [];
        }
        kvData[rule.support_url_pattern].push({
          nb_column: rule.nb_column || 1,
          insertion_method: rule.insertion_method || "append",
          support_block_location: rule.support_block_location || "body",
          support_page_type_pattern: rule.support_page_type_pattern || "none",
          links: relevantLinks.map(link => ({
            url: link.url,
            anchor_text: link.anchor_text,
          })),
        });
      }
    }
  
    return kvData;
  }
  