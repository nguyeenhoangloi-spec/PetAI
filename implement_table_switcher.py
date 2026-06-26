# -*- coding: utf-8 -*-
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# Read upgrade.html
with open('templates/upgrade.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Insert CSS
css_to_add = """
      /* Comparison Table Responsive Styles */
      @media (max-width: 1279.98px) {
        .comp-table-container table {
          min-width: 100% !important;
        }
        
        .comp-table-container th:nth-child(2), .comp-table-container td:nth-child(2),
        .comp-table-container th:nth-child(3), .comp-table-container td:nth-child(3),
        .comp-table-container th:nth-child(4), .comp-table-container td:nth-child(4),
        .comp-table-container th:nth-child(5), .comp-table-container td:nth-child(5) {
          display: none !important;
        }

        .show-col-free th:nth-child(2), .show-col-free td:nth-child(2) {
          display: table-cell !important;
          animation: fadeInUp 0.25s ease-out;
        }
        .show-col-basic th:nth-child(3), .show-col-basic td:nth-child(3) {
          display: table-cell !important;
          animation: fadeInUp 0.25s ease-out;
        }
        .show-col-pro th:nth-child(4), .show-col-pro td:nth-child(4) {
          display: table-cell !important;
          animation: fadeInUp 0.25s ease-out;
        }
        .show-col-enterprise th:nth-child(5), .show-col-enterprise td:nth-child(5) {
          display: table-cell !important;
          animation: fadeInUp 0.25s ease-out;
        }
        
        .comp-table-container th, .comp-table-container td {
          padding: 12px 8px !important;
        }
        .comp-table-container .comp-td-feature {
          width: 50% !important;
        }
        .comp-table-container th:not(.comp-td-feature), .comp-table-container td:not(.comp-td-feature) {
          width: 50% !important;
          text-align: center !important;
        }
      }

      /* Desktop Column Highlight on Hover */
      @media (min-width: 1280px) {
        .comp-table-container tr:hover td {
          background-color: rgba(248, 250, 252, 0.6);
        }
        html.dark .comp-table-container tr:hover td {
          background-color: rgba(30, 41, 59, 0.4);
        }
        .comp-col-pro {
          background-color: rgba(99, 102, 241, 0.02);
        }
        html.dark .comp-col-pro {
          background-color: rgba(99, 102, 241, 0.01);
        }
        .comp-table-container td {
          transition: background-color 0.2s ease;
        }
      }
"""

style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
styles = list(style_pattern.finditer(text))
main_style_match = max(styles, key=lambda m: len(m.group(1)))
main_style_content = main_style_match.group(1)

updated_style_content = main_style_content + css_to_add
text = text.replace(main_style_content, updated_style_content)
print("CSS added to main style block!")

# 2. Add Tab Switcher HTML and class to table container
# We look for: <!-- ── Comparison Table Section ── -->
# and insert switcher after the header block.
header_end_target = """            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white" data-i18n="comparisonTableTitle">So sánh các gói dịch vụ</h3>
          </div>"""

switcher_html = """          <!-- Tab Switcher (Mobile comparison toggle) -->
          <div class="flex xl:hidden border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-950/60 gap-1 mb-6" id="comp-tab-switcher">
            <button class="flex-1 py-2 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200" data-tab-target="free">FREE</button>
            <button class="flex-1 py-2 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200" data-tab-target="basic">BASIC</button>
            <button class="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition-all duration-200" data-tab-target="pro">PRO</button>
            <button class="flex-1 py-2 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200" data-tab-target="enterprise">ENTERPRISE</button>
          </div>"""

header_idx = text.find(header_end_target)
if header_idx >= 0:
    prefix = text[:header_idx + len(header_end_target)]
    suffix = text[header_idx + len(header_end_target):]
    text = prefix + "\n          \n" + switcher_html + suffix
    print("Tab Switcher HTML inserted!")
else:
    print("WARNING: Could not find table header end target!")

# 3. Add class to table container
# From: <div class="overflow-x-auto">
# To: <div class="overflow-x-auto comp-table-container show-col-pro">
# To make it selective, search right after the Tab Switcher.
table_container_target = '          <div class="overflow-x-auto">'
# Let's find it after the header_idx
table_container_idx = text.find(table_container_target, header_idx)
if table_container_idx >= 0:
    prefix = text[:table_container_idx]
    suffix = text[table_container_idx + len(table_container_target):]
    text = prefix + '          <div class="overflow-x-auto comp-table-container show-col-pro">' + suffix
    print("Table container class modified!")
else:
    print("WARNING: Could not find table container div!")

# 4. Insert Javascript
js_to_add = """
    // --- Comparison Table Tab Switcher (Mobile) ---
    document.addEventListener("DOMContentLoaded", () => {
      const switcher = document.getElementById("comp-tab-switcher");
      const container = document.querySelector(".comp-table-container");
      if (!switcher || !container) return;
      
      const buttons = switcher.querySelectorAll("button");
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          const target = btn.getAttribute("data-tab-target");
          
          // Update active button visual
          buttons.forEach(b => {
            b.className = "flex-1 py-2 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200";
          });
          
          if (target === 'pro') {
            btn.className = "flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-sm transition-all duration-200";
          } else if (target === 'enterprise') {
            btn.className = "flex-1 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-white shadow-sm transition-all duration-200";
          } else if (target === 'basic') {
            btn.className = "flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white shadow-sm transition-all duration-200";
          } else {
            btn.className = "flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-600 text-white shadow-sm transition-all duration-200";
          }
          
          // Update container class to show the column
          container.className = "overflow-x-auto comp-table-container show-col-" + target;
        });
      });
    });
"""

last_script_idx = text.rfind('</script>')
if last_script_idx >= 0:
    prefix = text[:last_script_idx]
    suffix = text[last_script_idx:]
    text = prefix + js_to_add + suffix
    print("JS logic added for Tab Switcher!")
else:
    print("WARNING: Could not find last script tag to append JS!")

# 5. Save file
with open('templates/upgrade.html', 'w', encoding='utf-8', newline='') as f:
    f.write(text)

print("Comparison table successfully updated!")
