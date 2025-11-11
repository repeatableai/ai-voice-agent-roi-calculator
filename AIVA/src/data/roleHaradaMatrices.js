// Harada Matrix definitions for all knowledge worker roles
// Each role has 5 core deliverables with Key Activities, Success Metrics, and Dependencies

export const HARADA_MATRICES = {
  'Sales Development Representative': {
    deliverables: [
      {
        name: 'Lead Qualification & Outreach Prioritization',
        keyActivities: ['Lead scoring and segmentation', 'Company research and intelligence gathering', 'Outreach sequence management', 'Response tracking and follow-up'],
        successMetrics: ['Connect rate with decision makers', 'Lead-to-qualified conversion rate', 'Response time (target <5 minutes)', 'Daily qualified leads handed to AEs'],
        dependencies: ['Marketing lead generation', 'CRM data quality', 'Sales enablement materials', 'Lead intelligence tools']
      },
      {
        name: 'Real-Time Objection Handling & Competitive Intelligence',
        keyActivities: ['Competitive research and battle card mastery', 'Objection handling practice', 'Call preparation and post-call analysis', 'Product knowledge development'],
        successMetrics: ['Objection resolution rate', 'Competitive win rate', 'Call-to-meeting conversion', 'Average qualification time per lead'],
        dependencies: ['Sales enablement team', 'Competitive intelligence database', 'Product marketing materials', 'Sales engineering support']
      },
      {
        name: 'Daily Activity Logging & Pipeline Updates',
        keyActivities: ['CRM activity logging', 'Pipeline hygiene maintenance', 'Touchpoint documentation', 'Daily/weekly reporting'],
        successMetrics: ['CRM data quality score (target >80%)', 'Activities logged per day (target 50+)', 'Pipeline accuracy', 'Forecast reliability'],
        dependencies: ['CRM platform', 'Sales operations processes', 'Manager reporting requirements', 'Lead routing automation']
      },
      {
        name: 'CRM Data Hygiene & Lead Source Attribution',
        keyActivities: ['Duplicate lead detection and merging', 'Missing data enrichment', 'Lead source correction', 'Contact information verification'],
        successMetrics: ['Data completeness rate', 'Duplicate lead percentage', 'Lead source attribution accuracy', 'Time spent on data cleanup'],
        dependencies: ['Data enrichment tools', 'Sales operations standards', 'Marketing attribution tracking', 'Lead generation campaigns']
      },
      {
        name: 'Competitive Intelligence & Objection Prep Research',
        keyActivities: ['Competitor monitoring and analysis', 'Battle card updates', 'Win/loss analysis', 'Market intelligence gathering'],
        successMetrics: ['Competitive objection handling speed', 'Win rate in competitive deals', 'Battle card currency', 'Confidence in competitive situations'],
        dependencies: ['Product marketing team', 'Sales enablement resources', 'Win/loss interview data', 'Competitive intelligence tools']
      }
    ]
  },

  'Customer Success Manager': {
    deliverables: [
      {
        name: 'Account Health Review & Renewal Risk Assessment',
        keyActivities: ['Weekly account health scoring', 'Usage trend analysis', 'Renewal risk identification', 'Executive reporting'],
        successMetrics: ['Net revenue retention rate', 'Churn rate', 'Early risk detection (60+ days)', 'Renewal forecast accuracy'],
        dependencies: ['Product usage analytics', 'Support ticket systems', 'Customer feedback tools', 'Account executive collaboration']
      },
      {
        name: 'Customer Escalation Response & Resolution Coordination',
        keyActivities: ['Escalation triage and prioritization', 'Cross-team coordination', 'Customer communication', 'Post-incident analysis'],
        successMetrics: ['Mean time to resolution', 'Escalation prevention rate', 'Customer satisfaction scores', 'Executive escalation frequency'],
        dependencies: ['Support engineering team', 'Product team', 'Executive stakeholders', 'Incident tracking systems']
      },
      {
        name: 'Quarterly Business Review (QBR) Preparation',
        keyActivities: ['Usage data compilation and analysis', 'ROI calculation', 'Success story documentation', 'Executive presentation development'],
        successMetrics: ['QBR completion rate', 'Expansion revenue from QBRs', 'Executive attendance rate', 'Customer satisfaction with QBRs'],
        dependencies: ['Product analytics platform', 'Customer usage data', 'Finance for ROI validation', 'Executive sponsors']
      },
      {
        name: 'Product Adoption Strategy & Feature Evangelism',
        keyActivities: ['Feature launch coordination', 'Customer training and enablement', 'Adoption tracking and outreach', 'Success metric monitoring'],
        successMetrics: ['Feature adoption rate (target 60%+)', 'Time to first value', 'Advanced feature usage', 'Product engagement scores'],
        dependencies: ['Product management team', 'Product marketing materials', 'Training resources', 'Customer success platform']
      },
      {
        name: 'Customer Feedback Synthesis & Product Intelligence',
        keyActivities: ['Feedback collection across touchpoints', 'Feature request categorization', 'Sentiment analysis', 'Product team communication'],
        successMetrics: ['Feedback capture rate', 'Feature request influence on roadmap', 'Customer voice representation', 'Product team responsiveness'],
        dependencies: ['Product management collaboration', 'Customer conversation recordings', 'Support ticket data', 'NPS/survey tools']
      }
    ]
  },

  'Software Engineer': {
    deliverables: [
      {
        name: 'Bug Investigation & Root Cause Analysis',
        keyActivities: ['Production incident response', 'Stack trace analysis', 'Root cause identification', 'Fix implementation and deployment'],
        successMetrics: ['Mean time to resolution', 'Bug recurrence rate', 'Production incident frequency', 'Customer-reported bugs'],
        dependencies: ['Error monitoring tools', 'Code repository access', 'Deployment pipelines', 'QA collaboration']
      },
      {
        name: 'Code Review Preparation & Technical Documentation',
        keyActivities: ['Pull request description writing', 'Code documentation', 'API documentation updates', 'Review feedback incorporation'],
        successMetrics: ['PR review cycle time', 'Documentation completeness', 'Code review quality scores', 'Merge frequency'],
        dependencies: ['Version control system', 'Documentation platform', 'Team code standards', 'CI/CD pipeline']
      },
      {
        name: 'Architecture Decision Research & Technology Evaluation',
        keyActivities: ['Technology research and comparison', 'Proof of concept development', 'Architecture documentation', 'Team consensus building'],
        successMetrics: ['Decision quality and confidence', 'Research thoroughness', 'Architecture doc completeness', 'Team alignment speed'],
        dependencies: ['Technical leadership input', 'Engineering team capacity', 'Vendor/tool access', 'Budget approval process']
      },
      {
        name: 'Technical Debt Assessment & Refactoring Prioritization',
        keyActivities: ['Code quality analysis', 'Tech debt cataloging', 'Impact vs effort estimation', 'Refactoring roadmap development'],
        successMetrics: ['Code quality trends', 'Tech debt reduction rate', 'Production incident correlation', 'Refactoring velocity'],
        dependencies: ['Code analysis tools', 'Team sprint capacity', 'Product roadmap priorities', 'Engineering leadership']
      },
      {
        name: 'Performance Optimization & Monitoring Setup',
        keyActivities: ['Performance profiling and analysis', 'Bottleneck identification', 'Optimization implementation', 'Monitoring configuration'],
        successMetrics: ['Application response times', 'Database query performance', 'API latency', 'Customer-reported performance issues'],
        dependencies: ['Performance monitoring tools', 'Production environment access', 'QA testing support', 'DevOps collaboration']
      }
    ]
  },

  'Marketing Manager': {
    deliverables: [
      {
        name: 'Campaign Performance Analysis & Budget Reallocation',
        keyActivities: ['Multi-channel data aggregation', 'CAC and ROI calculation', 'Budget optimization recommendations', 'Executive reporting'],
        successMetrics: ['Marketing ROI by channel', 'Cost per MQL/SQL', 'Budget allocation efficiency', 'Campaign performance trends'],
        dependencies: ['Marketing automation platform', 'CRM integration', 'Analytics tools', 'CFO budget approval']
      },
      {
        name: 'Content Strategy Development with Competitive Intelligence',
        keyActivities: ['Competitive content analysis', 'Topic research and prioritization', 'Content calendar development', 'SEO optimization'],
        successMetrics: ['Content engagement rates', 'Organic traffic growth', 'Lead generation from content', 'Thought leadership positioning'],
        dependencies: ['Content team', 'SEO tools', 'Competitive intelligence', 'Sales team feedback']
      },
      {
        name: 'Multi-Channel Attribution Reporting',
        keyActivities: ['Attribution model configuration', 'Customer journey mapping', 'Revenue attribution analysis', 'Channel performance reporting'],
        successMetrics: ['Attribution accuracy', 'First-touch/last-touch/multi-touch clarity', 'Marketing-influenced revenue', 'Channel ROI precision'],
        dependencies: ['Attribution platform', 'CRM data', 'Web analytics', 'Finance collaboration']
      },
      {
        name: 'Marketing Automation Workflow Optimization',
        keyActivities: ['Campaign workflow design', 'Lead scoring configuration', 'Email sequence development', 'A/B test setup'],
        successMetrics: ['Email engagement rates', 'Lead conversion rates', 'Workflow error rates', 'Campaign launch velocity'],
        dependencies: ['Marketing automation platform', 'CRM integration', 'Design resources', 'Sales team alignment']
      },
      {
        name: 'Competitive Positioning & Messaging Development',
        keyActivities: ['Competitive landscape analysis', 'Positioning framework creation', 'Messaging testing and refinement', 'Sales enablement alignment'],
        successMetrics: ['Message differentiation clarity', 'Win rate improvement', 'Sales team adoption', 'Competitive displacement rate'],
        dependencies: ['Product marketing team', 'Sales feedback', 'Customer research data', 'Competitive intelligence tools']
      }
    ]
  },

  'HR Manager': {
    deliverables: [
      {
        name: 'Talent Acquisition & Recruitment',
        keyActivities: ['Workforce planning', 'Candidate sourcing and screening', 'Interview coordination', 'Offer negotiation', 'Employer brand development'],
        successMetrics: ['Time-to-fill', 'Quality of hire retention rate', 'Offer acceptance rate', 'Cost-per-hire', 'Hiring manager satisfaction'],
        dependencies: ['Hiring managers', 'Recruiting team', 'ATS platform', 'Budget allocation', 'Employer brand materials']
      },
      {
        name: 'Employee Relations Issue Investigation & Policy Guidance',
        keyActivities: ['Complaint intake and triage', 'Investigation coordination', 'Policy interpretation', 'Resolution documentation', 'Legal compliance'],
        successMetrics: ['Investigation completion time', 'Policy violation rates', 'Employee satisfaction with process', 'Legal exposure incidents'],
        dependencies: ['Employment law expertise', 'Company policies', 'Legal team', 'Manager training', 'HRIS documentation']
      },
      {
        name: 'Compensation Benchmarking & Offer Preparation',
        keyActivities: ['Market data research', 'Internal equity analysis', 'Offer letter preparation', 'Budget validation', 'Negotiation support'],
        successMetrics: ['Offer competitiveness', 'Internal pay equity', 'Offer preparation speed', 'Candidate acceptance rate'],
        dependencies: ['Compensation survey data', 'Finance budget approval', 'HRIS salary data', 'Market intelligence tools']
      },
      {
        name: 'Performance Review Cycle Coordination',
        keyActivities: ['Review template distribution', 'Completion tracking', 'Calibration facilitation', 'Salary adjustment processing', 'Communication management'],
        successMetrics: ['Review completion rate', 'Calibration quality', 'Cycle completion time', 'Employee satisfaction with process'],
        dependencies: ['Manager participation', 'HRIS platform', 'Budget constraints', 'Executive approval', 'Performance templates']
      },
      {
        name: 'Employee Onboarding Program Optimization',
        keyActivities: ['Onboarding coordination', 'System access provisioning', 'Welcome experience design', 'First-week scheduling', 'Feedback collection'],
        successMetrics: ['Time-to-productivity', 'New hire satisfaction', 'System access completion time', '90-day retention rate'],
        dependencies: ['IT team', 'Hiring managers', 'Facilities', 'Onboarding technology', 'Training materials']
      }
    ]
  },

  'Financial Analyst': {
    deliverables: [
      {
        name: 'Variance Analysis & Executive Reporting',
        keyActivities: ['Actuals vs budget comparison', 'Variance explanation research', 'Executive summary preparation', 'Trend analysis'],
        successMetrics: ['Report timeliness (within 3 days of month close)', 'Variance explanation accuracy', 'Forecast precision', 'Executive actionability'],
        dependencies: ['ERP/accounting system', 'Department heads for variance explanations', 'Budget data', 'CFO reporting requirements']
      },
      {
        name: 'Budget vs Actuals Reconciliation',
        keyActivities: ['Weekly spend tracking', 'Account reconciliation', 'Accrual identification', 'Department reporting'],
        successMetrics: ['Budget utilization accuracy', 'Overspend prevention rate', 'Data reconciliation time', 'Department head responsiveness'],
        dependencies: ['Accounting system', 'AP/AR data', 'HRIS for payroll', 'Department budget owners']
      },
      {
        name: 'Financial Model Scenario Building',
        keyActivities: ['Assumption definition', 'Multi-scenario modeling', 'Sensitivity analysis', 'Executive presentation preparation'],
        successMetrics: ['Model accuracy vs actuals', 'Scenario comprehensiveness', 'Decision support value', 'Model complexity vs usability'],
        dependencies: ['Strategic planning input', 'Department forecasts', 'Historical financial data', 'Executive decision timeline']
      },
      {
        name: 'Cash Flow Forecasting & Working Capital Analysis',
        keyActivities: ['AR collection forecasting', 'AP obligation tracking', 'Cash runway calculation', 'Working capital optimization'],
        successMetrics: ['Forecast accuracy', 'Cash crisis prevention', 'Working capital efficiency', 'Credit line utilization'],
        dependencies: ['AR/AP aging reports', 'HRIS payroll data', 'Contract/commitment tracking', 'Treasury management']
      },
      {
        name: 'Executive Dashboard Creation & KPI Reporting',
        keyActivities: ['Weekly KPI compilation', 'Metric visualization', 'Trend identification', 'Alert generation for anomalies'],
        successMetrics: ['Dashboard timeliness', 'Metric accuracy', 'Executive engagement with dashboard', 'Decision velocity improvement'],
        dependencies: ['Multiple data sources', 'BI/visualization tools', 'Department KPI owners', 'Executive KPI preferences']
      }
    ]
  },

  'Operations Manager - Manufacturing': {
    deliverables: [
      {
        name: 'Production Planning & Schedule Optimization',
        keyActivities: ['Daily production meetings', 'Capacity planning', 'Resource allocation', 'Shift scheduling', 'Rush order integration'],
        successMetrics: ['On-time delivery rate', 'Capacity utilization', 'Schedule adherence', 'Rush order accommodation'],
        dependencies: ['Demand forecasts', 'Equipment availability', 'Labor resources', 'Material availability']
      },
      {
        name: 'Quality Investigation & Root Cause Analysis',
        keyActivities: ['Quality audits', 'Defect investigation', 'Corrective action oversight', 'Documentation and reporting'],
        successMetrics: ['Defect rate', 'First-pass yield', 'Compliance audit scores', 'Scrap and rework costs'],
        dependencies: ['Quality standards', 'Regulatory requirements', 'Testing equipment', 'Quality engineering team']
      },
      {
        name: 'Supplier Coordination & Issue Resolution',
        keyActivities: ['Vendor communication', 'Material planning', 'Logistics coordination', 'Supplier performance tracking'],
        successMetrics: ['Material availability', 'Supplier on-time delivery', 'Inventory turns', 'Supply disruption frequency'],
        dependencies: ['Procurement team', 'Suppliers', 'Transportation partners', 'Contract terms']
      },
      {
        name: 'Team Coaching & Performance Management',
        keyActivities: ['Team meetings', 'Performance reviews', 'Training coordination', 'Conflict resolution', 'Coaching conversations'],
        successMetrics: ['Employee engagement', 'Productivity per FTE', 'Turnover rate', 'Safety compliance'],
        dependencies: ['HR support', 'Training resources', 'Organizational policies', 'Supervisor development']
      },
      {
        name: 'Equipment Maintenance Planning & Downtime Prevention',
        keyActivities: ['Maintenance scheduling', 'Downtime tracking', 'Preventive maintenance oversight', 'Capital expenditure planning'],
        successMetrics: ['Equipment uptime', 'Mean time between failures', 'Maintenance costs', 'Unplanned downtime incidents'],
        dependencies: ['Maintenance team', 'Equipment vendors', 'Budget allocation', 'Sensor/monitoring systems']
      }
    ]
  },

  'Project Manager': {
    deliverables: [
      {
        name: 'Cross-Project Status Report Generation',
        keyActivities: ['Multi-project status aggregation', 'Risk and blocker identification', 'Team capacity tracking', 'Executive communication'],
        successMetrics: ['Reporting timeliness', 'Risk identification accuracy', 'Stakeholder satisfaction', 'Decision acceleration'],
        dependencies: ['Project tracking tools', 'Team updates', 'Resource management system', 'Executive reporting cadence']
      },
      {
        name: 'Risk Assessment & Mitigation Planning',
        keyActivities: ['Risk identification workshops', 'Historical analysis', 'Mitigation strategy development', 'Contingency planning'],
        successMetrics: ['Risk identification completeness', 'Mitigation effectiveness', 'Project delivery success rate', 'Budget contingency accuracy'],
        dependencies: ['Project team input', 'Historical project data', 'Subject matter experts', 'Executive sponsors']
      },
      {
        name: 'Resource Allocation & Conflict Resolution',
        keyActivities: ['Resource demand analysis', 'Conflict negotiation', 'Alternative solution development', 'Stakeholder communication'],
        successMetrics: ['Resource conflict resolution time', 'Solution acceptance rate', 'Project delay prevention', 'Team satisfaction'],
        dependencies: ['Resource management system', 'Project priorities', 'Team skill matrices', 'Executive decision authority']
      },
      {
        name: 'Stakeholder Communication & Expectation Management',
        keyActivities: ['Stakeholder update coordination', 'Question and concern response', 'Expectation setting and realignment', 'Decision documentation'],
        successMetrics: ['Stakeholder response time', 'Communication clarity scores', 'Expectation alignment', 'Decision velocity'],
        dependencies: ['Stakeholder availability', 'Communication tools', 'Project documentation', 'Change management processes']
      },
      {
        name: 'Retrospective Facilitation & Process Improvement',
        keyActivities: ['Retrospective preparation', 'Team feedback synthesis', 'Lessons learned documentation', 'Process improvement recommendations'],
        successMetrics: ['Retrospective actionability', 'Improvement implementation rate', 'Repeat mistake reduction', 'Team engagement in retros'],
        dependencies: ['Project data and metrics', 'Team participation', 'Organizational learning systems', 'Leadership support for changes']
      }
    ]
  },

  'Account Executive': {
    deliverables: [
      {
        name: 'Deal Strategy & Competitive Positioning',
        keyActivities: ['Competitive research', 'Battle card customization', 'Positioning document creation', 'Champion enablement'],
        successMetrics: ['Competitive win rate', 'Deal advancement velocity', 'Champion satisfaction', 'Positioning document impact'],
        dependencies: ['Sales enablement content', 'Competitive intelligence', 'Sales engineering support', 'Product marketing']
      },
      {
        name: 'Custom Proposal & Pricing Optimization',
        keyActivities: ['Pricing scenario analysis', 'Proposal customization', 'Discount approval management', 'Payment terms negotiation'],
        successMetrics: ['Proposal response time', 'Deal close rate', 'Average deal size', 'Discount approval success rate'],
        dependencies: ['Pricing guidelines', 'Sales operations', 'Finance approval', 'Proposal templates']
      },
      {
        name: 'C-Suite Meeting Preparation & Stakeholder Mapping',
        keyActivities: ['Company and executive research', 'ROI calculation', 'Custom pitch development', 'Objection preparation'],
        successMetrics: ['C-suite meeting-to-opportunity rate', 'Average deal size from C-suite engagement', 'Executive meeting quality scores'],
        dependencies: ['Sales research tools', 'Customer success insights', 'Sales engineering', 'Executive references']
      },
      {
        name: 'Pipeline Forecasting & Commit Call Preparation',
        keyActivities: ['Deal stage analysis', 'Engagement signal tracking', 'Weighted forecast calculation', 'Risk factor assessment'],
        successMetrics: ['Forecast accuracy (+/- 10%)', 'Commit attainment rate', 'Pipeline coverage ratio', 'Deal velocity trends'],
        dependencies: ['CRM data quality', 'Sales operations support', 'Sales methodology adherence', 'Historical close patterns']
      },
      {
        name: 'Contract Negotiation & Redline Review',
        keyActivities: ['Contract redline analysis', 'Legal risk assessment', 'Negotiation strategy development', 'Legal team coordination'],
        successMetrics: ['Contract turnaround time', 'Deal slippage due to legal (target <10%)', 'Acceptable terms rate', 'Legal escalation frequency'],
        dependencies: ['Legal team', 'Standard contract templates', 'Sales operations guidance', 'Executive approval thresholds']
      }
    ]
  },

  'Product Manager': {
    deliverables: [
      {
        name: 'Feature Prioritization with Customer Feedback Analysis',
        keyActivities: ['Feedback synthesis across channels', 'RICE/impact scoring', 'Engineering effort estimation', 'Roadmap sequencing'],
        successMetrics: ['Feature impact on key metrics', 'Customer request satisfaction', 'Roadmap predictability', 'Engineering team alignment'],
        dependencies: ['Customer feedback sources', 'Engineering team', 'Product analytics', 'Sales/CS input']
      },
      {
        name: 'Roadmap Communication & Stakeholder Alignment',
        keyActivities: ['Multi-audience presentation creation', 'Stakeholder feedback integration', 'Roadmap visualization', 'Alignment meeting facilitation'],
        successMetrics: ['Stakeholder alignment scores', 'Roadmap clarity ratings', 'Cross-functional buy-in', 'Scope change frequency'],
        dependencies: ['Engineering capacity', 'Company strategy', 'Sales/CS/Marketing input', 'Executive approval']
      },
      {
        name: 'Competitive Feature Analysis & Positioning',
        keyActivities: ['Competitive feature monitoring', 'Build vs buy analysis', 'Market trend research', 'Strategic recommendation development'],
        successMetrics: ['Competitive response speed', 'Feature parity assessment', 'Win/loss analysis insight', 'Strategic decision quality'],
        dependencies: ['Competitive intelligence', 'Engineering feasibility input', 'Market research data', 'Executive decision timeline']
      },
      {
        name: 'User Research Synthesis & Insight Generation',
        keyActivities: ['Interview recording analysis', 'Pattern identification', 'Persona development', 'Requirements documentation'],
        successMetrics: ['Research-to-decision time', 'Insight actionability', 'Feature success correlation', 'Research comprehensiveness'],
        dependencies: ['User research participants', 'Recording tools', 'Product team', 'Design collaboration']
      },
      {
        name: 'Go-to-Market Planning & Launch Coordination',
        keyActivities: ['Cross-functional launch planning', 'Sales/CS enablement', 'Marketing campaign coordination', 'Success metrics definition'],
        successMetrics: ['Launch execution quality', 'Feature adoption rate', 'Cross-team alignment', 'Time-to-market'],
        dependencies: ['Engineering delivery', 'Sales team', 'Marketing team', 'CS team', 'Analytics setup']
      }
    ]
  },

  'Supply Chain Manager': {
    deliverables: [
      {
        name: 'Inventory Optimization & Demand Forecasting',
        keyActivities: ['Demand analysis', 'Safety stock calculation', 'Inventory rebalancing', 'SKU rationalization'],
        successMetrics: ['Inventory carrying costs', 'Stockout frequency', 'Inventory turns', 'Forecast accuracy'],
        dependencies: ['ERP system data', 'Sales forecasts', 'Supplier lead times', 'Working capital constraints']
      },
      {
        name: 'Logistics Disruption Response & Alternative Routing',
        keyActivities: ['Disruption monitoring', 'Alternative route analysis', 'Cost-benefit evaluation', 'Customer communication'],
        successMetrics: ['Disruption response time', 'Delivery performance despite disruptions', 'Alternative routing costs', 'Customer satisfaction'],
        dependencies: ['Logistics partners', 'Transportation network options', 'Customer delivery windows', 'Budget flexibility']
      },
      {
        name: 'Supplier Performance Analysis & Negotiations',
        keyActivities: ['Performance data compilation', 'SLA compliance tracking', 'Negotiation preparation', 'Contract term optimization'],
        successMetrics: ['Supplier on-time delivery rate', 'Quality defect rates', 'Cost savings from negotiations', 'Payment terms optimization'],
        dependencies: ['Supplier performance data', 'Contract terms', 'Procurement team', 'Finance collaboration']
      },
      {
        name: 'Demand-Supply Matching & Production Planning Coordination',
        keyActivities: ['Customer order translation', 'Material availability checking', 'Production capacity verification', 'Supplier coordination'],
        successMetrics: ['Order fulfillment rate', 'Production schedule adherence', 'Material shortage incidents', 'Customer delivery performance'],
        dependencies: ['Sales orders', 'Production schedules', 'Supplier lead times', 'Manufacturing coordination']
      },
      {
        name: 'Cost Reduction Analysis & Strategic Sourcing',
        keyActivities: ['Spend analysis', 'Alternative supplier evaluation', 'Volume consolidation opportunity identification', 'Cost reduction planning'],
        successMetrics: ['Cost savings achieved', 'Sourcing diversification', 'Total cost of ownership reduction', 'Supply chain resilience'],
        dependencies: ['Spend data', 'Market intelligence', 'Supplier alternatives', 'Executive approval for changes']
      }
    ]
  },

  'Quality Assurance Manager': {
    deliverables: [
      {
        name: 'Test Case Prioritization & Coverage Analysis',
        keyActivities: ['Code change impact analysis', 'Risk-based test prioritization', 'Coverage gap identification', 'Test plan creation'],
        successMetrics: ['Test coverage percentage', 'Critical path coverage', 'Bug escape rate', 'Release confidence level'],
        dependencies: ['Engineering code changes', 'Test management platform', 'Historical defect data', 'Release timeline']
      },
      {
        name: 'Defect Triage & Severity Assessment',
        keyActivities: ['Bug report review', 'Severity classification', 'Team assignment', 'Duplicate identification'],
        successMetrics: ['Triage time per bug', 'Severity accuracy', 'Engineering team capacity utilization', 'Bug backlog health'],
        dependencies: ['Bug tracking system', 'Engineering team capacity', 'Severity criteria', 'Product priorities']
      },
      {
        name: 'Release Readiness Reporting',
        keyActivities: ['Test execution analysis', 'Open bug assessment', 'Risk evaluation', 'Go/no-go recommendation'],
        successMetrics: ['Release decision confidence', 'Post-release incident rate', 'Recommendation accuracy', 'Decision timeliness'],
        dependencies: ['Test execution data', 'Code coverage metrics', 'Bug tracking', 'Engineering leadership']
      },
      {
        name: 'Test Automation ROI Analysis & Tool Selection',
        keyActivities: ['Tool evaluation', 'ROI modeling', 'Implementation planning', 'Resource estimation'],
        successMetrics: ['Automation coverage growth', 'ROI realization', 'Tool adoption success', 'Manual testing reduction'],
        dependencies: ['Engineering resources', 'Budget approval', 'Technology stack compatibility', 'Team skill levels']
      },
      {
        name: 'Quality Metrics Reporting & Trend Analysis',
        keyActivities: ['Multi-source data aggregation', 'Metric calculation', 'Trend identification', 'Improvement recommendations'],
        successMetrics: ['Defect density trends', 'Escape rate', 'Mean time to resolution', 'Customer-reported bugs'],
        dependencies: ['JIRA/bug tracking', 'Test management system', 'Monitoring tools', 'Support ticket data']
      }
    ]
  },

  'IT Support Specialist': {
    deliverables: [
      {
        name: 'Ticket Prioritization & Knowledge Base Search',
        keyActivities: ['Ticket queue review', 'Urgency assessment', 'Knowledge base article matching', 'Auto-response generation'],
        successMetrics: ['SLA compliance rate', 'First response time', 'Ticket resolution rate', 'Knowledge base hit rate'],
        dependencies: ['Ticketing system', 'Knowledge base', 'SLA definitions', 'Escalation procedures']
      },
      {
        name: 'Multi-System Troubleshooting & Diagnostic Guidance',
        keyActivities: ['Symptom analysis', 'Root cause diagnosis', 'Solution testing', 'Documentation'],
        successMetrics: ['Mean time to resolution', 'First-contact resolution rate', 'Escalation rate', 'Customer satisfaction'],
        dependencies: ['System access', 'Diagnostic tools', 'Vendor support', 'Knowledge base']
      },
      {
        name: 'User Training & Documentation Creation',
        keyActivities: ['Training material development', 'Documentation writing', 'FAQ creation', 'User guide updates'],
        successMetrics: ['Documentation completeness', 'User adoption of self-service', 'Training effectiveness', 'Ticket volume reduction'],
        dependencies: ['System access', 'Documentation platform', 'Subject matter experts', 'User feedback']
      },
      {
        name: 'System Upgrade Planning & Change Management',
        keyActivities: ['Compatibility assessment', 'Upgrade timeline development', 'User communication planning', 'Pilot testing coordination'],
        successMetrics: ['Upgrade success rate', 'User disruption minimization', 'Migration completeness', 'Post-upgrade incident rate'],
        dependencies: ['Vendor documentation', 'Test environment', 'User base coordination', 'Executive approval']
      },
      {
        name: 'Security Incident Response & Compliance Reporting',
        keyActivities: ['Incident detection and analysis', 'Containment execution', 'Compliance documentation', 'Remediation planning'],
        successMetrics: ['Incident containment time', 'Data exposure scope', 'Compliance reporting timeliness', 'Repeat incident rate'],
        dependencies: ['Security monitoring tools', 'Legal/compliance team', 'Executive notification protocols', 'Incident response playbooks']
      }
    ]
  },

  'Business Development Manager': {
    deliverables: [
      {
        name: 'Partnership Opportunity Evaluation & ROI Analysis',
        keyActivities: ['Partner research', 'Opportunity sizing', 'ROI modeling', 'Strategic fit assessment'],
        successMetrics: ['Partnership success rate', 'Partner-sourced revenue', 'Deal evaluation thoroughness', 'Time to partnership decision'],
        dependencies: ['Market intelligence', 'Finance for modeling', 'Product/engineering for feasibility', 'Executive approval']
      },
      {
        name: 'Market Research & Competitive Landscape Mapping',
        keyActivities: ['Market sizing analysis', 'Competitor identification', 'Regulatory research', 'Go-to-market strategy development'],
        successMetrics: ['Market entry success rate', 'Research comprehensiveness', 'Strategic recommendation quality', 'Executive decision confidence'],
        dependencies: ['Market research tools', 'Industry contacts', 'Analyst reports', 'Finance/strategy teams']
      },
      {
        name: 'Deal Structuring & Term Sheet Negotiation Prep',
        keyActivities: ['Term sheet analysis', 'Financial modeling', 'Negotiation leverage identification', 'Counter-proposal development'],
        successMetrics: ['Deal terms favorability', 'Negotiation cycle time', 'Partnership value realization', 'Legal risk minimization'],
        dependencies: ['Legal team', 'Finance approval', 'Market benchmark data', 'Executive negotiation authority']
      },
      {
        name: 'Channel Partner Enablement & Performance Management',
        keyActivities: ['Partner performance tracking', 'Enablement program delivery', 'QBR preparation', 'Performance intervention planning'],
        successMetrics: ['Partner quota attainment', 'Partner-sourced pipeline', 'Enablement program effectiveness', 'Partner satisfaction'],
        dependencies: ['CRM partner data', 'Marketing co-op funds', 'Enablement materials', 'Partner success team']
      },
      {
        name: 'Strategic Alliance & Joint Venture Structuring',
        keyActivities: ['Alliance structure evaluation', 'Financial scenario modeling', 'Due diligence coordination', 'Term sheet development'],
        successMetrics: ['Alliance success rate', 'Revenue realization', 'Strategic value creation', 'Partnership longevity'],
        dependencies: ['Legal counsel', 'Finance modeling', 'Executive stakeholders', 'Product/engineering resources']
      }
    ]
  },

  'Executive Assistant': {
    deliverables: [
      {
        name: 'Calendar Optimization & Meeting Preparation',
        keyActivities: ['Calendar conflict resolution', 'Meeting briefing preparation', 'Attendee research', 'Focus time blocking'],
        successMetrics: ['Calendar utilization efficiency', 'Meeting preparation completeness', 'Executive meeting effectiveness', 'Focus time preservation'],
        dependencies: ['Executive preferences', 'Team availability', 'Meeting platforms', 'Background information sources']
      },
      {
        name: 'Travel Coordination with Multi-Variable Constraints',
        keyActivities: ['Multi-city itinerary planning', 'Constraint optimization', 'Approval coordination', 'Logistics booking'],
        successMetrics: ['Itinerary accuracy', 'Constraint satisfaction', 'Booking efficiency', 'Travel disruption recovery'],
        dependencies: ['Travel policy', 'Approval workflows', 'Booking systems', 'Executive preferences']
      },
      {
        name: 'Information Synthesis & Briefing Document Creation',
        keyActivities: ['Multi-source data collection', 'Executive summary writing', 'Key insight identification', 'Decision framework presentation'],
        successMetrics: ['Briefing comprehensiveness', 'Executive decision velocity', 'Information accuracy', 'Briefing timeliness'],
        dependencies: ['Department heads', 'Data sources', 'Executive priorities', 'Meeting deadlines']
      },
      {
        name: 'Expense Report Processing & Budget Tracking',
        keyActivities: ['Receipt categorization', 'Policy compliance checking', 'Expense report submission', 'Budget tracking'],
        successMetrics: ['Processing time', 'Submission timeliness', 'Policy compliance rate', 'Finance team satisfaction'],
        dependencies: ['Expense system', 'Finance team', 'Receipt documentation', 'Corporate policies']
      },
      {
        name: 'Meeting Notes & Action Item Tracking',
        keyActivities: ['Real-time note capture', 'Decision documentation', 'Action item extraction', 'Follow-up coordination'],
        successMetrics: ['Note distribution speed', 'Action item completion rate', 'Decision clarity', 'Meeting effectiveness'],
        dependencies: ['Recording/transcription tools', 'Action item tracking system', 'Attendee accountability', 'Meeting platforms']
      }
    ]
  }
};

// Helper function to get Harada Matrix for a specific role
export const getHaradaMatrixForRole = (jobTitle) => {
  return HARADA_MATRICES[jobTitle] || {
    deliverables: [
      {
        name: 'Primary Role Deliverable',
        keyActivities: ['Core responsibilities', 'Stakeholder management', 'Performance optimization'],
        successMetrics: ['Output quality', 'Efficiency metrics', 'Stakeholder satisfaction'],
        dependencies: ['Team collaboration', 'System access', 'Resource allocation']
      }
    ]
  };
};
