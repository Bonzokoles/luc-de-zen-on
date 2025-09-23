
import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function analyzeBundleSize() {
  const distPath = './dist';
  const files = await readdir(distPath, { recursive: true });
  
  const analysis = [];
  
  for (const file of files) {
    const filePath = join(distPath, file);
    const stats = await stat(filePath);
    
    if (stats.isFile() && file.endsWith('.js')) {
      analysis.push({
        file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024)
      });
    }
  }
  
  // Sort by size
  analysis.sort((a, b) => b.size - a.size);
  
  console.log('📊 Bundle Analysis:');
  analysis.slice(0, 10).forEach(item => {
    console.log(`${item.file}: ${item.sizeKB}KB`);
  });
  
  return analysis;
}

// Dodaj te nowe funkcje:
async function findDuplicateModules() {
  console.log('\n🔍 Searching for duplicate modules...');
  const distPath = './dist';
  const files = await readdir(distPath, { recursive: true });
  
  const moduleMap = new Map();
  
  for (const file of files) {
    if (file.endsWith('.js')) {
      const filePath = join(distPath, file);
      const content = await readFile(filePath, 'utf-8');
      
      // Look for common patterns that indicate duplicates
      const imports = content.match(/import.*from.*['"]([^'"]+)['"]/g) || [];
      imports.forEach(imp => {
        const module = imp.match(/['"]([^'"]+)['"]/)?.[1];
        if (module) {
          if (!moduleMap.has(module)) {
            moduleMap.set(module, []);
          }
          moduleMap.get(module).push(file);
        }
      });
    }
  }
  
  // Find duplicates
  const duplicates = Array.from(moduleMap.entries())
    .filter(([module, files]) => files.length > 1)
    .slice(0, 10);
    
  if (duplicates.length > 0) {
    console.log('⚠️  Potential duplicate modules:');
    duplicates.forEach(([module, files]) => {
      console.log(`  ${module}: used in ${files.length} files`);
    });
  } else {
    console.log('✅ No obvious duplicates found');
  }
}

async function generateOptimizationReport() {
  console.log('\n📋 Generating optimization report...');
  
  const analysis = await analyzeBundleSize();
  await findDuplicateModules();
  
  const totalSize = analysis.reduce((sum, item) => sum + item.size, 0);
  const totalSizeKB = Math.round(totalSize / 1024);
  const totalSizeMB = Math.round(totalSize / (1024 * 1024) * 100) / 100;
  
  console.log('\n📈 Summary:');
  console.log(`Total JS bundle size: ${totalSizeKB}KB (${totalSizeMB}MB)`);
  console.log(`Number of JS files: ${analysis.length}`);
  console.log(`Largest file: ${analysis[0]?.file} (${analysis[0]?.sizeKB}KB)`);
  
  // Recommendations
  console.log('\n💡 Optimization recommendations:');
  if (totalSizeKB > 5000) {
    console.log('  - Consider code splitting for large bundles');
  }
  if (analysis.length > 100) {
    console.log('  - Too many JS files, consider bundling optimization');
  }
  if (analysis[0]?.sizeKB > 1000) {
    console.log('  - Largest file is very big, consider lazy loading');
  }
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    totalSizeKB,
    totalSizeMB,
    fileCount: analysis.length,
    largestFiles: analysis.slice(0, 10),
    recommendations: []
  };
  
  await writeFile('./dist/bundle-analysis.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Report saved to ./dist/bundle-analysis.json');
}

// Run analysis
generateOptimizationReport().catch(console.error);
