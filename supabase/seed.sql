-- Everything Automation - Seed Data
-- Run this after migration.sql to populate sample data

INSERT INTO ea_systems (slug, title, short_description, long_description, category, status, order_index, attributes)
VALUES
(
  'invoice-processing-automation',
  'Invoice Processing Automation',
  'Automatically extract, validate, and process invoices from multiple sources with AI-powered data extraction.',
  'Our Invoice Processing Automation system transforms your accounts payable workflow. Using advanced OCR and machine learning, the system automatically extracts key data from invoices regardless of format or source. It validates information against your vendor database, flags discrepancies, routes approvals, and integrates directly with your ERP system. Reduce manual data entry by 90% and accelerate payment cycles while maintaining complete audit trails.',
  'Finance',
  'live',
  1,
  '{
    "steps": [
      "Invoice arrives via email, scan, or upload",
      "AI extracts vendor, amounts, line items, and dates",
      "System validates against PO and vendor records",
      "Discrepancies flagged for review",
      "Approved invoices pushed to ERP for payment"
    ],
    "tools": ["OCR Engine", "Machine Learning Models", "ERP Integration", "Email Parser"],
    "outputs": ["Structured invoice data", "Validation reports", "ERP journal entries", "Audit logs"],
    "benefits": ["90% reduction in manual entry", "3x faster processing", "99.5% accuracy rate"]
  }'::jsonb
),
(
  'employee-onboarding-workflow',
  'Employee Onboarding Workflow',
  'Streamline new hire onboarding with automated provisioning, document collection, and training assignments.',
  'Transform your employee onboarding from a weeks-long manual process into a seamless automated experience. This system orchestrates everything from offer letter generation to IT provisioning, benefits enrollment, and training assignments. New hires receive personalized onboarding portals, managers get real-time progress dashboards, and HR eliminates repetitive administrative tasks. Ensure compliance, reduce time-to-productivity, and create a memorable first impression.',
  'HR',
  'live',
  2,
  '{
    "steps": [
      "HR initiates onboarding in HRIS",
      "System generates offer letter and collects e-signatures",
      "IT receives automated provisioning requests",
      "Benefits enrollment forms sent to new hire",
      "Training modules assigned based on role",
      "Manager receives progress updates"
    ],
    "tools": ["HRIS Integration", "DocuSign", "Active Directory", "LMS Connector"],
    "outputs": ["Provisioned accounts", "Completed documents", "Training assignments", "Compliance records"],
    "benefits": ["50% faster onboarding", "Zero missed steps", "Improved new hire satisfaction"]
  }'::jsonb
),
(
  'inventory-reorder-system',
  'Inventory Reorder System',
  'Intelligent inventory monitoring with automatic reorder triggers and supplier communication.',
  'Never run out of critical inventory again. Our Inventory Reorder System continuously monitors stock levels across all your locations, predicts demand based on historical patterns and seasonality, and automatically generates purchase orders when thresholds are reached. The system selects optimal suppliers based on price, lead time, and reliability scores, then tracks orders through delivery. Integrate with your WMS and ERP for a complete supply chain solution.',
  'Operations',
  'live',
  3,
  '{
    "steps": [
      "Real-time inventory level monitoring",
      "Demand forecasting using ML models",
      "Automatic reorder point detection",
      "Supplier selection and PO generation",
      "Order tracking and receipt confirmation",
      "Inventory records updated automatically"
    ],
    "tools": ["WMS Integration", "Demand Forecasting Engine", "Supplier Portal", "ERP Connector"],
    "outputs": ["Purchase orders", "Demand forecasts", "Supplier scorecards", "Stock reports"],
    "benefits": ["40% reduction in stockouts", "25% lower carrying costs", "Optimized supplier relationships"]
  }'::jsonb
),
(
  'customer-support-ticket-routing',
  'Customer Support Ticket Routing',
  'AI-powered ticket classification and intelligent routing to the right support agents.',
  'Revolutionize your customer support operations with intelligent ticket routing. Our system uses natural language processing to understand ticket content, sentiment, and urgency. It automatically categorizes issues, identifies VIP customers, detects escalation triggers, and routes tickets to the best-qualified available agent. Integration with your knowledge base enables auto-suggested responses, while analytics dashboards provide insights into support trends and agent performance.',
  'Customer Service',
  'live',
  4,
  '{
    "steps": [
      "Ticket received from any channel",
      "NLP analyzes content and sentiment",
      "System classifies issue type and priority",
      "Customer tier and history retrieved",
      "Optimal agent selected and assigned",
      "Suggested responses provided to agent"
    ],
    "tools": ["NLP Engine", "CRM Integration", "Knowledge Base", "Analytics Dashboard"],
    "outputs": ["Classified tickets", "Agent assignments", "Response suggestions", "Performance metrics"],
    "benefits": ["60% faster first response", "35% higher CSAT scores", "Reduced escalations"]
  }'::jsonb
),
(
  'report-generation-automation',
  'Report Generation Automation',
  'Scheduled data aggregation and report generation with automatic distribution to stakeholders.',
  'Eliminate the tedious manual work of compiling reports. This automation system connects to all your data sources, aggregates information according to your specifications, generates formatted reports, and distributes them on schedule. Whether its daily sales summaries, weekly KPI dashboards, or monthly board reports, the system handles everything automatically. Customize templates, set up conditional alerts, and ensure stakeholders always have the insights they need.',
  'Analytics',
  'live',
  5,
  '{
    "steps": [
      "Scheduled trigger or manual request initiates report",
      "Data pulled from configured sources",
      "Aggregation and calculations performed",
      "Report formatted using template",
      "Quality checks and validations run",
      "Report distributed via email, portal, or Slack"
    ],
    "tools": ["Data Connectors", "Report Builder", "Template Engine", "Distribution Service"],
    "outputs": ["Formatted reports (PDF, Excel, HTML)", "Data visualizations", "Alert notifications", "Audit trails"],
    "benefits": ["Hours saved weekly", "Consistent formatting", "Never miss a deadline"]
  }'::jsonb
);
