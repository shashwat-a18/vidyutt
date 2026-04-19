import mongoose from 'mongoose';
import FaultDecisionTree from '../models/FaultDecisionTree.js';
import FaultChecklist from '../models/FaultChecklist.js';
import dotenv from 'dotenv';

dotenv.config();

const analyzeTree = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const tree = await FaultDecisionTree.find().sort({ questionId: 1 });
    const checklists = await FaultChecklist.find().sort({ faultId: 1 });

    console.log('\n📋 FAULT DECISION TREE COMPLETE ANALYSIS');
    console.log('═══════════════════════════════════════════════\n');

    // Summary
    console.log(`📊 SUMMARY:`);
    console.log(`  Total Tree Nodes: ${tree.length}`);
    console.log(`  Available Fault Checklists: ${checklists.length}\n`);

    // Tree structure
    console.log(`🌳 TREE STRUCTURE:\n`);
    tree.forEach((node) => {
      const level = node.questionId.includes('Q3')
        ? '   └─ [Level 3]'
        : node.questionId.includes('Q2')
        ? '  ├─ [Level 2]'
        : '┌─ [Level 1]';
      console.log(`${level} ${node.questionId}: ${node.questionText}`);
      node.options.forEach((opt, idx) => {
        const isLast = idx === node.options.length - 1;
        const connector = isLast ? '       └─ ' : '       ├─ ';
        const resolution = opt.resolvedFaultId ? ` → ${opt.resolvedFaultId}` : ` → ${opt.nextQuestionId}`;
        console.log(`${connector}${opt.label}${resolution}`);
      });
      console.log('');
    });

    // Fault checklist verification
    console.log(`✅ AVAILABLE FAULT RESOLUTIONS:\n`);
    checklists.forEach((fault) => {
      console.log(`🔧 ${fault.faultId}`);
      console.log(`   Title: ${fault.faultTitle}`);
      console.log(`   Severity: ${fault.severity}`);
      console.log(`   Checklist Steps: ${fault.checklist?.length || 0}`);
      if (fault.immediateActions?.length > 0) {
        console.log(`   Immediate Actions: ${fault.immediateActions.length}`);
      }
      console.log('');
    });

    // Path validation
    console.log(`🔍 PATH VALIDATION:\n`);
    const allFaultIds = new Set();
    tree.forEach((node) => {
      node.options?.forEach((opt) => {
        if (opt.resolvedFaultId) allFaultIds.add(opt.resolvedFaultId);
      });
    });

    const faultIds = Array.from(allFaultIds);
    const existingIds = checklists.map((c) => c.faultId);
    const missing = faultIds.filter((id) => !existingIds.includes(id));

    console.log(`Fault IDs Referenced: ${faultIds.length}`);
    faultIds.forEach((id) => console.log(`  ✓ ${id}`));

    if (missing.length > 0) {
      console.log(`\n❌ MISSING FAULTS (${missing.length}):`);
      missing.forEach((id) => console.log(`   ✗ ${id}`));
    } else {
      console.log(`\n✅ All fault references are valid!`);
    }

    // Diagnostic paths
    console.log(`\n📍 DIAGNOSTIC PATHS (from Q1):\n`);
    const q1 = tree.find((n) => n.questionId === 'Q1');
    q1?.options.forEach((path, idx) => {
      console.log(`${idx + 1}. ${path.label} → ${path.nextQuestionId}`);
    });

    console.log(`\n✅ TREE ANALYSIS COMPLETE!\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error analyzing tree:', error.message);
    process.exit(1);
  }
};

analyzeTree();
