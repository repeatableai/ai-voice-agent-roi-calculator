// Comprehensive role-specific deliverables with detailed, realistic scenarios
// Each role has 3 hyper-detailed deliverables showing specific workflows, tools, and AI voice transformations

export const ROLE_DELIVERABLES = {
  'Sales Development Representative': (hourlyRate) => [
    {
      id: 1,
      title: 'Lead Qualification & Outreach Prioritization',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.20,
      frequency: 'daily',
      occurrencesPerYear: 250,
      timeMultiplier: 10.0,
      annualHoursFreed: 450,
      payrollFreed: 450 * hourlyRate,
      scenario: 'It\'s 9:15 AM Monday. You open Salesforce and see 127 new leads from the weekend webinar, plus 43 inbound form fills, and your manager just Slacked: "Prioritize enterprise leads first—board wants pipeline numbers by Wednesday." You have 8 hours of scheduled calls today.',
      oldWay: 'Open Salesforce → Filter leads manually → Open each lead record individually → Check company LinkedIn → Google the company → Visit their website → Check ZoomInfo for employee count → Cross-reference with ideal customer profile spreadsheet → Manually score each lead → Update lead score field → Assign to sequences → Log activity notes. For 127 leads, you can realistically process maybe 40-50 in 2 hours before calls start, meaning 80+ leads sit untouched until tomorrow (or next week).',
      aiVoiceWay: 'While making your coffee, you say: "AIVA, scan the 127 new leads. Show me enterprise companies with 500+ employees in tech or financial services, with Director+ titles, that visited our pricing page. Rank by engagement score and tell me the top 10." In 15 seconds: "Found 23 matching leads. Top lead: Sarah Chen, VP of Sales at DataCorp, 2,400 employees, SaaS company with $85M funding, visited pricing 4 times, opened 3 emails. Currently using Competitor A. 9 other high-priority leads ready. Should I draft personalized outreach for the top 10?" You say "Yes" while walking to your desk. Boom—you\'re ready to start calling by 9:30 AM instead of 11:00 AM.',
      didYouKnow: {
        show: true,
        insight: 'SDRs who contact leads within 5 minutes are 21x more likely to qualify them than those who wait an hour. By processing leads in 12 minutes instead of 2 hours, you contact prospects 1 hour 48 minutes faster—dramatically improving connect rates and conversion.'
      },
      valueAddedSuggestion: {
        hours: 1.8,
        activity: 'Strategic Account Research & Personalization',
        description: 'Deep-dive into top 20% of accounts, build custom talk tracks, create account maps',
        expectedImpact: 'Increases connect rate 40-60%, boosts qualification rate 25-35%'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Has faster lead response improved your qualification or connect rates?',
          options: [
            { value: 'higher_connect', label: 'Yes, I\'m connecting with 30-50% more decision makers', impact: 'high' },
            { value: 'better_quality', label: 'Yes, I\'m qualifying better-fit prospects', impact: 'high' },
            { value: 'faster_handoff', label: 'Yes, I\'m handing leads to AEs faster', impact: 'medium' },
            { value: 'none', label: 'Still measuring impact', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Real-Time Objection Handling & Competitive Intelligence',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.10,
      frequency: 'per call session',
      occurrencesPerYear: 200,
      timeMultiplier: 15.0,
      annualHoursFreed: 280,
      payrollFreed: 280 * hourlyRate,
      scenario: 'You\'re on a discovery call with a qualified lead. They say: "We\'re currently using [Competitor X] and they just gave us a 20% discount. Why should we switch?" You need the right answer in 3 seconds or lose credibility.',
      oldWay: 'Put them on hold ("Let me grab that information...") → Frantically search Slack for competitive intel → Check the shared Google Drive for battle cards → Can\'t find the right file → Search email for "Competitor X comparison" → Find outdated doc from 8 months ago → Scramble to remember the differentiation points from last week\'s sales meeting → Come back to call 45 seconds later sounding uncertain. Often you say "Great question, let me get back to you on that" (translation: the deal cools off).',
      aiVoiceWay: 'The prospect says "Competitor X" and within 2 seconds, AIVA whispers in your ear: "Competitor X strengths: price, simple UI. Your advantages: enterprise security SOC2 Type 2, native Salesforce integration, 24/7 support. Recent win over them: TechCorp cited integration and uptime as key factors. Suggested response: \'Many customers come from Competitor X for our enterprise-grade security and seamless Salesforce integration—like TechCorp who switched 3 months ago. May I ask what challenges you\'ve had with their uptime?\'" You smoothly deliver the response without missing a beat. Prospect says "Actually, yes, we had two outages last quarter..." Deal momentum: maintained.',
      didYouKnow: {
        show: true,
        insight: 'Sales reps who handle objections confidently in under 5 seconds increase close rates by 2.3x compared to those who hesitate or defer. Real-time AI coaching gives you instant expert-level responses without years of experience.'
      },
      valueAddedSuggestion: {
        hours: 1.4,
        activity: 'Advanced Sales Skill Development',
        description: 'Review call recordings, practice advanced objection handling, role-play scenarios',
        expectedImpact: 'Accelerates ramp time by 60%, improves win rate 20-30%'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Daily Activity Logging & Pipeline Updates',
      category: 'top5',
      baselineHours: 1.0,
      aiEnabledHours: 0.05,
      frequency: 'daily',
      occurrencesPerYear: 250,
      timeMultiplier: 20.0,
      annualHoursFreed: 237.5,
      payrollFreed: 237.5 * hourlyRate,
      scenario: 'It\'s 5:30 PM. You had 12 calls today, sent 47 emails, and attended 2 meetings. Now you need to log everything in Salesforce before you leave—your manager checks activity metrics daily and you\'re behind on your "50 touches per day" quota.',
      oldWay: 'Open Salesforce → Find each lead/contact from memory → Click "Log a Call" → Type what happened → Select outcome → Add next steps → Update lead status → Remember you forgot to log 3 other calls → Go back and find them → Check your email sent folder to remember who you emailed → Log emails one by one → Update opportunity stages → Add notes. Takes 45-60 minutes of mind-numbing data entry when you\'re already mentally exhausted. Often you just give up and say "I\'ll do it tomorrow" (but tomorrow you have 24 activities to log...).',
      aiVoiceWay: 'At 5:30 PM, while packing your laptop, you say: "AIVA, log today\'s activities." AIVA responds: "I tracked 12 calls, 47 emails, and 2 meetings. Should I log everything to Salesforce with auto-generated notes?" You say "Yes." In 3 minutes, all activities are logged with AI-generated summaries: "Discussed pricing with Sarah Chen, next step: send proposal by Thursday. Qualified John Smith at Acme Corp, scheduling demo for next Tuesday. Follow-up needed with 8 leads who opened proposal but haven\'t responded." Done. You leave at 5:33 PM instead of 6:15 PM.',
      didYouKnow: {
        show: true,
        insight: 'SDRs spend an average of 21% of their time on admin work instead of selling. Eliminating 45 minutes of daily data entry equals 187 hours per year—that\'s 4.5 full weeks of additional selling time.'
      },
      valueAddedSuggestion: {
        hours: 0.95,
        activity: 'Pipeline Strategy & Deal Coaching',
        description: 'Analyze pipeline health, identify at-risk deals, strategize high-value opportunities',
        expectedImpact: 'Increases pipeline quality 30-40%, accelerates deal velocity'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'CRM Data Hygiene & Lead Source Attribution',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.15,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 10.0,
      annualHoursFreed: 67.5,
      payrollFreed: 67.5 * hourlyRate,
      scenario: 'It\'s Friday afternoon. Your sales ops manager Slacks: "Your data quality score is at 67%—we need it above 80% by Monday. Too many leads missing company info, lead sources are wrong, and duplicates are everywhere. Can you clean this up?" You have 247 leads in your pipeline and manually cleaning data is the worst.',
      oldWay: 'Open Salesforce → Filter your leads → Start with missing company info → Open each lead → Google the company to find employee count, industry, revenue → Update fields manually → Next lead → Repeat 84 times → Now check for duplicates → Sort by company name → Manually scan for duplicates → Find 23 duplicate leads → Merge them one by one (each merge takes 2 minutes because you need to choose which data to keep) → Now fix lead sources → Half your leads show "Direct" or "Other" source → Check your email to see where they actually came from → Try to remember which webinar or campaign → Update lead source → Realize some came from partner referrals but partner name isn\'t captured → Add notes → Takes 90 minutes and you\'ve only cleaned 60% of your pipeline. Data quality score: 73% (still not 80%).',
      aiVoiceWay: 'Friday at 3 PM, you say: "AIVA, clean my pipeline data. Fill in missing company info, fix lead sources, merge duplicates, and get data quality above 80%." In 10 minutes, AIVA responds: "Analyzed 247 leads. Missing company info: Found and populated data for 84 leads using LinkedIn and company databases (employee count, industry, revenue, headquarters). Duplicates: Identified 23 duplicate leads across 12 companies—recommended primary record for each, ready to merge. Lead source corrections: 47 leads marked Direct or Other—I traced 38 back to specific campaigns using email history and UTM parameters: 18 from September webinar, 12 from LinkedIn ads, 8 from partner TechPartner Inc. 9 couldn\'t be determined. Data quality score after cleanup: 86%. Should I execute all changes?" You say "Yes." Data cleaned in 12 minutes. You send screenshot to sales ops at 3:15 PM. Manager response: "Wow, that was fast! Nice work."',
      didYouKnow: {
        show: true,
        insight: 'Sales teams with clean CRM data close deals 27% faster because reps spend less time hunting for information and more time actually selling. But manual data cleanup is so tedious that most SDRs avoid it until forced—AI makes it painless.'
      },
      valueAddedSuggestion: {
        hours: 1.35,
        activity: 'Deep Account Research & Buying Committee Mapping',
        description: 'Research key accounts, identify all decision makers, understand org structure and politics',
        expectedImpact: 'Increases multi-threading success rate, shortens sales cycles by 30-40%'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Competitive Intelligence & Objection Prep Research',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.20,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 7.5,
      annualHoursFreed: 65,
      payrollFreed: 65 * hourlyRate,
      scenario: 'Your sales team meeting is Monday morning. Your manager says: "We\'re seeing Competitor X in 60% of our deals now. I need everyone to come prepared with their latest positioning, pricing, and customer wins. Study up this weekend." You need to become an expert on Competitor X by Monday.',
      oldWay: 'Visit Competitor X website → Click through their product pages → Watch 3 demo videos (45 minutes total) → Read their case studies → Check G2 reviews—read through 50+ reviews to understand strengths and weaknesses → Google "Competitor X vs our company" → Find 2 old comparison articles from 2022 (outdated) → Check their LinkedIn to see recent announcements → Sign up for their email list to see messaging → Search your company Slack for mentions of Competitor X → Find scattered conversations → Try to piece together competitive intel → Check if sales enablement has battle cards → Find battle card from 6 months ago → Not sure what\'s current → Build your own notes document. Takes 2+ hours of weekend time.',
      aiVoiceWay: 'Saturday morning, while having coffee at home, you say: "AIVA, create a competitive intelligence brief on Competitor X. Include their positioning, pricing, strengths, weaknesses, recent product launches, customer sentiment, and how we win against them." In 20 minutes, AIVA provides: "Competitor X intelligence brief: Positioning: Mid-market focused, emphasizing ease of use and fast implementation. Pricing: $12K-$45K annually (20-30% cheaper than us for small deals, similar for enterprise). Strengths: Simple UI, quick onboarding (2 weeks vs our 6 weeks), strong partner ecosystem. Weaknesses: Limited enterprise features, no advanced reporting, security concerns (not SOC 2 Type 2 certified), 92% uptime (vs our 99.9%). Recent launches: Mobile app (September), basic AI features (October). Customer sentiment: 4.2/5 on G2 (238 reviews), praise for simplicity, complaints about lack of features for growing companies. How we win: 67% win rate in head-to-head deals. Key differentiators: Enterprise security, advanced analytics, 24/7 support, better for companies over 200 employees. Talk track: Many customers start with Competitor X but switch to us when they need enterprise features and reliability—like TechCorp who switched after an outage cost them $50K. Battle card updated with latest intel ready." You review (15 minutes), practice your talk track. Monday meeting: You are the most prepared person in the room.',
      didYouKnow: {
        show: true,
        insight: 'SDRs who can confidently handle competitive objections in the first 30 seconds of a call have 3.2x higher qualification rates. But staying current on 3-5 competitors requires 10+ hours monthly—AI compresses this to 30 minutes.'
      },
      valueAddedSuggestion: {
        hours: 1.3,
        activity: 'Sales Skill Development & Roleplay Practice',
        description: 'Practice objection handling, improve discovery questions, refine pitch delivery',
        expectedImpact: 'Shortens ramp time by 50%, increases confidence and close rates'
      },
      additionalImpactQuestions: []
    }
  ],

  'Customer Success Manager': (hourlyRate) => [
    {
      id: 1,
      title: 'Account Health Review & Renewal Risk Assessment',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.25,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 12.0,
      annualHoursFreed: 137.5,
      payrollFreed: 137.5 * hourlyRate,
      scenario: 'It\'s Monday morning. You manage 45 accounts worth $2.3M in ARR. 8 accounts are up for renewal in the next 90 days. Your VP Slacks: "Need a renewal risk report by noon for the exec team." You haven\'t checked most accounts in 2 weeks because you\'ve been firefighting a critical escalation.',
      oldWay: 'Open Gainsight → Check health scores for each account → Open Salesforce to see renewal dates → Check Zendesk for support ticket volume → Log into the product to see usage metrics → Open Google Sheets to check NPS scores → Cross-reference with contract values → Check Slack for any complaints → Email AEs to ask about expansion conversations → Build a spreadsheet manually categorizing accounts as Green/Yellow/Red → Write a narrative explaining each at-risk account. Takes 3+ hours, and by the time you\'re done, you discover two accounts that should have been flagged weeks ago.',
      aiVoiceWay: 'While walking to your desk with coffee, you say: "AIVA, analyze renewal risk for all accounts renewing in 90 days. Include usage trends, support ticket volume, engagement scores, and any recent complaints." In 30 seconds, AIVA responds: "8 accounts renewing in 90 days, total $890K ARR. 2 high-risk accounts: TechCorp—usage down 40% last 30 days, 7 support tickets, exec sponsor hasn\'t logged in for 3 weeks, expansion talks stalled. GlobalCo—NPS dropped from 8 to 4, submitted a feature request 6 weeks ago with no response. 3 medium-risk accounts, 3 healthy accounts. Should I draft the exec report and schedule check-in calls with at-risk accounts?" You say "Yes" and sit down. Report generated and sent by 9:15 AM. Exec meeting: nailed.',
      didYouKnow: {
        show: true,
        insight: 'CSMs who proactively identify at-risk accounts 60+ days before renewal have 3.5x higher save rates than those who react when contracts are expiring. Early AI-powered detection turns firefighting into prevention.'
      },
      valueAddedSuggestion: {
        hours: 2.75,
        activity: 'Strategic Account Growth Planning',
        description: 'Develop expansion strategies, build executive relationships, create success plans',
        expectedImpact: 'Increases net revenue retention 15-25%, drives 30-50% more expansions'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Has earlier risk detection helped save renewals or prevent churn?',
          options: [
            { value: 'saved_account', label: 'Yes, saved 1+ accounts worth $50K+ each', impact: 'high' },
            { value: 'prevented_churn', label: 'Yes, prevented churn through early intervention', impact: 'high' },
            { value: 'improved_nps', label: 'Yes, improved NPS and customer satisfaction', impact: 'medium' },
            { value: 'none', label: 'Still building the process', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Customer Escalation Response & Resolution Coordination',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per escalation',
      occurrencesPerYear: 80,
      timeMultiplier: 8.3,
      annualHoursFreed: 176,
      payrollFreed: 176 * hourlyRate,
      scenario: 'It\'s 2:47 PM Thursday. You get an urgent Slack from your customer: "Our production system is down. We\'ve been waiting 3 hours for support. If this isn\'t fixed in 1 hour, we\'re escalating to your CEO. What\'s going on?!" You were in back-to-back meetings and had no idea this was happening.',
      oldWay: 'Panic mode activated → Check Zendesk for their ticket (which support queue is it in?) → Find 3 different tickets from them today → Read through all the back-and-forth → Slack the support team "What\'s happening with Acme Corp ticket?" → Wait 10 minutes for response → Support says "Engineering is looking at it" → Slack engineering "How long until Acme is fixed?" → Wait 15 minutes → No response → Check JIRA to find the bug → Can\'t find it → Ask product team → They say "We need more info from customer" → But customer is furious and won\'t engage → You\'re stuck in the middle coordinating 4 teams, sending 23 Slack messages, and updating the customer every 20 minutes with "We\'re still working on it..." Total chaos for 2.5 hours.',
      aiVoiceWay: 'You see the angry Slack message. While walking out of your meeting, you say: "AIVA, what\'s happening with Acme Corp\'s support tickets?" In 5 seconds, AIVA says: "3 open tickets. Critical issue: Production API returning 500 errors starting at 11:42 AM. Engineering identified a database connection pool exhaustion issue. Fix is being deployed to production now. ETA 15 minutes. Root cause: traffic spike from their new feature launch overwhelmed connection limits. Suggest immediate response: acknowledge issue, provide ETA, offer post-mortem meeting tomorrow." You call the customer immediately with specific details and a timeline. Issue resolved at 3:18 PM. Customer says "Thank you for the clear communication—this is why we love working with you." Crisis averted in 20 minutes instead of 2.5 hours.',
      didYouKnow: {
        show: true,
        insight: 'Customer escalations cost an average of $5,000-$15,000 in discounts, credits, or emergency resources per incident. Resolving escalations 2 hours faster prevents customers from involving executives and dramatically improves retention.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Proactive Success Program Development',
        description: 'Build playbooks, establish early warning systems, create escalation prevention strategies',
        expectedImpact: 'Reduces escalations by 50-70%, improves CSAT scores 20-30 points'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Did faster escalation resolution prevent customer churn or executive escalation?',
          options: [
            { value: 'prevented_churn', label: 'Yes, prevented customer from churning ($50K+ ARR saved)', impact: 'high' },
            { value: 'prevented_exec_escalation', label: 'Yes, resolved before it reached their executive team', impact: 'high' },
            { value: 'improved_relationship', label: 'Yes, strengthened customer relationship', impact: 'medium' },
            { value: 'none', label: 'Resolved the issue, no additional impact', impact: 'none' }
          ]
        },
        {
          id: 'q2',
          question: 'Did others in your organization benefit from your rapid response?',
          options: [
            { value: 'became_standard', label: 'Yes, it became our new escalation response process', impact: 'high' },
            { value: 'helped_team', label: 'Yes, other CSMs adopted this approach', impact: 'medium' },
            { value: 'trained_support', label: 'Yes, trained support team on faster escalation handling', impact: 'medium' },
            { value: 'none', label: 'Just solved this immediate issue', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Quarterly Business Review (QBR) Preparation',
      category: 'top5',
      baselineHours: 4.0,
      aiEnabledHours: 0.45,
      frequency: 'quarterly per account',
      occurrencesPerYear: 60,
      timeMultiplier: 8.9,
      annualHoursFreed: 213,
      payrollFreed: 213 * hourlyRate,
      scenario: 'You have a QBR scheduled with your largest account (GlobalCorp, $450K ARR) next Tuesday at 10 AM. Their VP of Operations and CFO are attending. You need to show ROI, usage insights, success metrics, and present expansion opportunities. It\'s Thursday afternoon and you haven\'t started the deck.',
      oldWay: 'Open the QBR template → Pull usage data from 3 different dashboards → Export CSVs → Manually create charts in Google Sheets → Check support tickets to calculate resolution times → Interview their main users to get testimonial quotes → Research their business goals from the sales notes → Try to calculate ROI (complicated math involving license costs, time saved, productivity gains) → Cross-reference with their success plan from 6 months ago → Build a custom deck with their branding → Realize halfway through you need more data → Go back and pull additional reports → Stay late Thursday and Friday building the perfect deck. Final deck done Sunday night. Stress level: maximum.',
      aiVoiceWay: 'Thursday at 4 PM, while driving home, you say: "AIVA, prepare a QBR for GlobalCorp. Include usage metrics, ROI calculation, support performance, adoption trends, and identify 3 expansion opportunities based on their usage patterns." By the time you get home (25 minutes), AIVA has: analyzed 12 months of data, calculated that GlobalCorp has saved $280K in operational efficiency, identified that they\'re only using 60% of available features (expansion opportunity: advanced reporting module), flagged that their finance team isn\'t using the tool yet (expansion opportunity: 15 more seats), and created a draft deck with 12 slides. Friday morning, you spend 45 minutes reviewing, customizing, and rehearsing. QBR delivered Tuesday: flawless. CFO says "This is the best vendor QBR we\'ve ever seen—you really understand our business." Expansion deal: closed 2 weeks later for $90K.',
      didYouKnow: {
        show: true,
        insight: 'Executive-level QBRs that demonstrate clear ROI and strategic value result in 4.2x higher expansion rates than generic check-ins. But most CSMs spend 80% of QBR prep time on data gathering instead of strategic thinking—AI flips that ratio.'
      },
      valueAddedSuggestion: {
        hours: 3.55,
        activity: 'Executive Relationship Building & Strategic Advisory',
        description: 'Deep customer business strategy sessions, industry insights sharing, peer networking',
        expectedImpact: 'Becomes trusted advisor, drives executive sponsorship, unlocks enterprise-wide expansion'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Product Adoption Strategy & Feature Evangelism',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per major feature launch',
      occurrencesPerYear: 40,
      timeMultiplier: 8.0,
      annualHoursFreed: 70,
      payrollFreed: 70 * hourlyRate,
      scenario: 'Your product team just launched a new advanced analytics feature. Product manager says: "We need 60% of enterprise customers using this feature within 90 days to hit our product adoption OKR. Can you drive adoption with your accounts?" You manage 45 accounts and need to create customized enablement plans for each.',
      oldWay: 'Review the new feature documentation (30 minutes to understand it yourself) → Identify which customers would benefit most → Check usage data to see who is already using it (none, it just launched) → Create a generic email announcing the feature → Send to all 45 accounts → Get 4 responses → Schedule training calls with interested customers → Create training materials from scratch → Deliver 8 training sessions (1 hour each) → Follow up to see if they adopted it → Check usage dashboard weekly → Realize adoption is only at 12% after 4 weeks → Don\'t understand why → Try different approaches (more emails, Slack messages) → Adoption slowly crawls to 23% by day 90. Miss OKR. Don\'t know why it didn\'t work.',
      aiVoiceWay: 'Product team announces launch Wednesday. While walking to lunch, you say: "AIVA, analyze my 45 accounts and identify which ones would benefit most from the new analytics feature. Create customized enablement plans for the top 20." In 30 minutes, AIVA provides: "Advanced analytics feature adoption analysis: 28 of your 45 accounts are good fit based on their data usage patterns and business needs. Top 20 prioritized by impact: TechCorp (currently manually exporting data daily—this feature saves them 10 hours/week), GlobalCo (asked for custom reporting 3 times—this solves their need), DataInc (power users, early adopters, will love this). For each account: Customized email explaining specific benefits for their use case, suggested talking points, training session outline, success metrics. Adoption strategy: Week 1—email top 20 accounts with personalized benefits, Week 2—deliver group training webinar, Week 3—1-on-1 enablement for strategic accounts, Week 4—showcase early wins to drive broader adoption. Calendar invites and email templates ready." You review (20 minutes), launch plan same day. Results at day 90: 67% adoption (beat OKR). Product team: thrilled.',
      didYouKnow: {
        show: true,
        insight: 'Feature adoption drives renewal rates and expansion—customers using advanced features have 2.8x higher renewal rates and expand 3.1x more. But most CSMs struggle with adoption because they lack time for personalized enablement—AI makes it scalable.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Customer Innovation Workshops & Use Case Development',
        description: 'Help customers discover innovative ways to use your product, document success stories, build case studies',
        expectedImpact: 'Drives deeper product engagement, creates referenceable customers, increases expansion revenue 50-80%'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Customer Feedback Synthesis & Product Intelligence',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'monthly',
      occurrencesPerYear: 12,
      timeMultiplier: 8.3,
      annualHoursFreed: 26.4,
      payrollFreed: 26.4 * hourlyRate,
      scenario: 'Monthly product team meeting is tomorrow. Your Head of Product asks: "What are customers asking for? What are the top feature requests? Any common pain points we should know about?" You have hundreds of customer conversations from the last month scattered across Zoom recordings, email threads, Slack messages, and support tickets.',
      oldWay: 'Try to remember conversations from the last 30 days → Open your notes document (sparse notes at best) → Search email for "feature request" → Find 47 emails → Read through each one → Take notes → Check Slack DMs with customers → Find feature requests buried in casual conversations → Check support tickets → Read through 120+ tickets → Find 18 feature requests → Check Zoom recording transcripts (only if you remembered to record) → Try to identify patterns → Manually count how many customers mentioned each feature → Build spreadsheet: "Advanced filtering—mentioned by 8 customers, Export functionality—mentioned by 12 customers..." → Categorize by theme → Write summary for product team → Takes 2.5 hours, still feel like you\'re missing important feedback.',
      aiVoiceWay: 'Day before product meeting, while finishing your last call of the day, you say: "AIVA, analyze all customer feedback from the last 30 days. Identify top feature requests, common pain points, and any trends by customer segment." In 20 minutes, AIVA provides: "Customer feedback analysis (last 30 days, 45 accounts, 287 interactions): Top feature requests: 1) Bulk export to Excel (requested by 18 enterprise customers, all in finance industry, blocking 2 expansions worth $80K). 2) Advanced filtering with saved views (requested by 14 customers, especially power users). 3) Mobile app offline mode (requested by 9 field service customers). 4) SSO integration with Okta (requested by 8 customers, security requirement). 5) Custom reporting builder (requested by 12 customers, current workaround is manual CSV exports). Common pain points: Report loading speed (mentioned by 23 customers, especially those with large datasets). Sentiment trends: Overall satisfaction 8.1/10 (up from 7.8 last month), but enterprise customers frustrated with lack of advanced features (6.4/10). Customer segment insights: Enterprise customers need bulk operations and SSO. SMB customers love simplicity but want more integrations. Detailed feedback summary with customer quotes ready." You review (15 minutes), present to product team next day. Product team: "This is incredibly valuable—let\'s prioritize bulk export and SSO." Your customers\' voices: heard.',
      didYouKnow: {
        show: true,
        insight: 'Product teams that receive monthly customer feedback synthesis from CSMs build 3.4x more impactful features than those relying on occasional surveys. Your voice becomes the customer voice that shapes the product roadmap.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic Product Partnership & Influence',
        description: 'Partner with product team on roadmap priorities, beta test new features, drive customer advisory board',
        expectedImpact: 'Positions you as strategic product partner, influences roadmap, builds stronger customer relationships'
      },
      additionalImpactQuestions: []
    }
  ],

  'Software Engineer': (hourlyRate) => [
    {
      id: 1,
      title: 'Bug Investigation & Root Cause Analysis',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per critical bug',
      occurrencesPerYear: 100,
      timeMultiplier: 8.3,
      annualHoursFreed: 220,
      payrollFreed: 220 * hourlyRate,
      scenario: 'It\'s 10:15 AM. Your Slack explodes: "URGENT: Payment processing failing in production. 47 customers affected. Revenue blocked. All hands on deck!" You were in flow state working on a new feature and now need to context switch immediately.',
      oldWay: 'Switch git branches → Pull latest production code → Check error monitoring (Datadog? Sentry?) → See cryptic stack trace → Google the error message → Read 6 Stack Overflow threads → Check recent deployments in Jenkins → Find 3 possible culprits → git blame to see who wrote the code → Read through 847 lines of payment logic → Add debug logging → Redeploy → Wait 5 minutes → Check logs → Still not enough info → Add more logging → Redeploy again → Finally understand the issue: A recent API change from Stripe broke the payment validation logic → Fix the code → Write tests → Deploy → Verify fix. 2.5 hours later, issue resolved, but you\'ve completely lost context on your original feature work.',
      aiVoiceWay: 'You see the urgent Slack. While walking to grab water, you say: "AIVA, analyze production payment errors in the last hour. Show me the stack traces, recent code changes, and related dependencies." In 20 seconds, AIVA responds: "47 payment failures starting at 10:03 AM. Stack trace points to stripeValidation.js line 284. Root cause: Stripe API version was updated in commit f7a2c3d by Mark yesterday at 4:17 PM. The validation logic expects field \'payment_intent\' but Stripe v12 renamed it to \'payment_id\'. Suggested fix: Update field name on line 284 and add backward compatibility check. Would you like me to generate the fix with tests?" You say "Yes, show me the diff." You review the AI-generated code on your laptop, verify it\'s correct, commit, and deploy. Issue resolved in 18 minutes. You\'re back to your feature work by 10:35 AM.',
      didYouKnow: {
        show: true,
        insight: 'Context switching costs developers 23 minutes per interruption to regain full focus. By resolving critical bugs 2+ hours faster, you save both customer revenue and preserve your most valuable asset: focused coding time.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Proactive Code Quality & Architecture Improvement',
        description: 'Refactor technical debt, improve test coverage, implement monitoring, prevent future bugs',
        expectedImpact: 'Reduces production bugs by 40-60%, improves system reliability and team velocity'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Has faster bug resolution prevented customer impact or revenue loss?',
          options: [
            { value: 'prevented_revenue_loss', label: 'Yes, prevented/minimized revenue loss for customers', impact: 'high' },
            { value: 'reduced_downtime', label: 'Yes, reduced downtime significantly', impact: 'high' },
            { value: 'preserved_focus', label: 'Yes, preserved my focus and productivity', impact: 'medium' },
            { value: 'none', label: 'Still measuring', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Code Review Preparation & Technical Documentation',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.20,
      frequency: 'per code review',
      occurrencesPerYear: 150,
      timeMultiplier: 7.5,
      annualHoursFreed: 195,
      payrollFreed: 195 * hourlyRate,
      scenario: 'You just finished a complex feature: 847 lines of code across 12 files, including database migrations, API changes, and frontend updates. Now you need to create a pull request with clear documentation so your team can review it. But you\'re exhausted from coding and documentation is your least favorite part.',
      oldWay: 'Write PR description explaining what changed (try to remember everything you did over the last 3 days) → Document breaking changes → List testing steps → Remember you forgot to add unit tests for 2 edge cases → Go back and write tests → Update the PR description → Realize you should probably update the API documentation → Open Confluence → Find the right page → Update docs with new endpoints → Remember to document the database migration steps → Add screenshots of the new UI → Anticipate questions reviewers will ask and add FAQ section → Final PR description is done but it took 90 minutes and you\'re mentally drained.',
      aiVoiceWay: 'You push your final commit. While stretching at your desk, you say: "AIVA, analyze my feature branch and generate a PR description. Include what changed, why, testing steps, and any breaking changes." In 15 seconds, AIVA responds: "Feature: User role-based permissions system. Changes: 12 files modified, 3 new database tables, 7 new API endpoints, React components updated. Breaking changes: API route /admin/users changed to /api/v2/users—requires frontend update. Test coverage: 94%. Suggested testing steps: 1) Create new user with editor role, 2) Verify permission restrictions, 3) Test admin override functionality. Should I generate the PR description and update API docs?" You say Yes. PR created with comprehensive documentation. You click Submit and go back to planning your next feature. Documentation time: 12 minutes instead of 90.',
      didYouKnow: {
        show: true,
        insight: 'Well-documented PRs get reviewed 3x faster and have 60% fewer back-and-forth cycles. By making documentation effortless, AI increases your team\'s overall velocity by reducing review bottlenecks.'
      },
      valueAddedSuggestion: {
        hours: 1.3,
        activity: 'Deep Work on Complex Problems',
        description: 'Focus on architectural challenges, performance optimization, strategic technical initiatives',
        expectedImpact: 'Solves harder problems, accelerates career growth, increases technical impact'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Architecture Decision Research & Technology Evaluation',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'per major decision',
      occurrencesPerYear: 40,
      timeMultiplier: 7.5,
      annualHoursFreed: 104,
      payrollFreed: 104 * hourlyRate,
      scenario: 'Your team needs to choose a new database for the notification system. Current PostgreSQL setup is struggling with write-heavy workloads (50K writes/second at peak). Options: Stay with Postgres and optimize, migrate to Cassandra, try MongoDB, or use a managed service like DynamoDB. The decision needs to be made by Friday\'s architecture review meeting.',
      oldWay: 'Research each database option → Read documentation for Cassandra → Watch YouTube tutorials → Read 15 blog posts comparing NoSQL databases → Check StackOverflow for real-world experiences → Benchmark performance (set up test environments, write test scripts, run load tests) → Compare costs on AWS pricing calculator → Consider operational complexity → Read about other companies\' experiences (search for "Cassandra at scale") → Compile pros and cons into a spreadsheet → Write a 6-page architecture decision document → Realize you forgot to evaluate DynamoDB → Research DynamoDB → Update document. Spend entire Tuesday and Wednesday researching (16+ hours), only to still feel uncertain about the decision.',
      aiVoiceWay: 'Monday morning, while getting coffee, you say: "AIVA, compare database options for a write-heavy notification system handling 50K writes/second. Compare PostgreSQL optimization, Cassandra, MongoDB, and DynamoDB. Include performance, cost, operational complexity, and recommendations from companies at our scale." During your coffee break (20 minutes), AIVA provides: "Analysis of 4 options based on 247 technical articles, 18 case studies, and benchmarks. DynamoDB recommended: handles 50K+ writes/second easily, fully managed (zero ops), auto-scaling, cost estimate $2,400/month at your load. Cassandra offers better cost ($800/month) but requires 2 engineers to manage clusters. PostgreSQL optimization possible but hits ceiling at 40K writes/second. MongoDB not ideal for write-heavy workloads based on 6 failed migrations from similar companies. Detailed comparison table and architecture decision doc ready." You spend 30 minutes reviewing, validating assumptions, and customizing the recommendation. Friday meeting: You present with confidence, decision made: DynamoDB. Total research time: 40 minutes instead of 16 hours.',
      didYouKnow: {
        show: true,
        insight: 'Engineering teams make 50-100 technology decisions per year. Making each decision 2.5 hours faster frees up 125-250 hours annually per engineer—that\'s 3-6 weeks of additional development time for your team.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Strategic Technical Leadership',
        description: 'Mentor junior engineers, drive architectural vision, evaluate emerging technologies',
        expectedImpact: 'Accelerates team capability, improves system design quality, positions for Staff Engineer role'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Technical Debt Assessment & Refactoring Prioritization',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.35,
      frequency: 'quarterly',
      occurrencesPerYear: 4,
      timeMultiplier: 7.1,
      annualHoursFreed: 8.6,
      payrollFreed: 8.6 * hourlyRate,
      scenario: 'Your engineering manager says: "We need to allocate 20% of next quarter\'s sprint capacity to technical debt. I need you to assess our codebase and recommend what we should tackle first. Due by Friday for quarterly planning meeting." You have 47,000 lines of code across 340 files, 89 TODO comments, and everyone has opinions on what needs refactoring.',
      oldWay: 'Run code quality tools (SonarQube, CodeClimate) → Wait 20 minutes for analysis → Get overwhelming report: 847 code smells, 234 duplicated blocks, 67 security vulnerabilities, cyclomatic complexity issues → Try to prioritize which matter → Read through critical issues → Some are false positives → Check git blame to see who wrote problematic code → Review TODO comments scattered across codebase → Some are 2 years old → Interview 5 engineers: "What tech debt bothers you most?" → Get 5 different answers → Try to quantify impact of each tech debt item → Estimate effort to fix → Build prioritization matrix → Argue with team about priorities → Finally agree on top 10 items → Write proposal document. Takes 2.5+ hours spread over 3 days.',
      aiVoiceWay: 'Tuesday morning, you say: "AIVA, analyze our codebase for technical debt. Prioritize by business impact, risk, and effort to fix. Include code quality issues, security vulnerabilities, performance bottlenecks, and architectural concerns. Recommend top 10 items for next quarter." In 25 minutes, AIVA provides: "Technical debt analysis (47,000 lines, 340 files): Critical issues: 1) Authentication module has 3 security vulnerabilities (high risk, 8 hours to fix, affects all users). 2) Database query inefficiency in reporting module (causing 15-second load times, 12 hours to optimize, affects 80% of users daily). 3) Payment processing has no test coverage (blocks new payment methods, 20 hours to add tests, risk: payment failures). High-priority: 4) Duplicated business logic across 12 files (maintenance burden, 16 hours to consolidate). 5) Deprecated API endpoints still in use (blocks v3 API launch, 12 hours to migrate). 6-10: Additional items ranked by ROI. Estimated total effort: 94 hours (fits in 20% of quarter capacity). Business impact: Fixes 2 customer-facing issues, reduces bug rate 35%, unblocks 2 roadmap items. Detailed refactoring plan with effort estimates ready." You review (20 minutes), present to team Wednesday. Team aligned in 15-minute meeting. Quarterly planning: done.',
      didYouKnow: {
        show: true,
        insight: 'Teams that systematically address technical debt have 50% fewer production incidents and ship features 40% faster. But tech debt assessment is so time-consuming that most teams either skip it or argue endlessly about priorities—AI provides objective, data-driven prioritization.'
      },
      valueAddedSuggestion: {
        hours: 2.15,
        activity: 'System Architecture & Design Pattern Development',
        description: 'Design scalable architectures, establish coding standards, build reusable components',
        expectedImpact: 'Reduces future technical debt, improves code quality, accelerates team velocity long-term'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Performance Optimization & Monitoring Setup',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'per performance issue',
      occurrencesPerYear: 30,
      timeMultiplier: 7.5,
      annualHoursFreed: 78,
      payrollFreed: 78 * hourlyRate,
      scenario: 'Customer support escalates: "Enterprise customer GlobalCorp says the dashboard is taking 45 seconds to load. They have 500 users complaining. This is urgent—they\'re threatening to churn ($450K ARR)." You need to find and fix the performance issue fast.',
      oldWay: 'Check production monitoring (DataDog, New Relic) → See dashboard endpoint taking 42 seconds → Check database slow query log → Find 12 slow queries → Which one is causing the issue? → Add performance profiling to local environment → Try to reproduce the issue with production-like data → Can\'t reproduce locally (production has 10M records, local has 1K) → Request database query logs from DevOps → Wait 30 minutes → Analyze query execution plans → Find N+1 query problem → Also find missing database index → Also find inefficient JSON serialization → Fix all 3 issues → Write tests → Deploy to staging → Load test with production data volume → Still slow → Investigate further → Find caching issue → Fix caching → Finally fast → Deploy to production → Total time: 6 hours over 2 days. Customer: frustrated by the delay.',
      aiVoiceWay: 'Support escalates the issue at 2:15 PM. While walking to a quiet room, you say: "AIVA, diagnose performance issue with GlobalCorp dashboard. It\'s taking 45 seconds to load for 500 users." In 8 minutes, AIVA responds: "Performance analysis for GlobalCorp dashboard (42.3 seconds average load time): Root causes identified: 1) N+1 query problem in user permissions check—making 500 database queries instead of 1 (accounts for 28 seconds of load time). 2) Missing database index on user_id + org_id composite key (adds 8 seconds). 3) No caching on organization settings (adds 4 seconds). 4) JSON serialization of large dataset not optimized (adds 2 seconds). Suggested fixes: Add eager loading to permissions query, create composite database index, implement Redis caching for org settings, optimize JSON response. Estimated effort: 4 hours. Expected load time after fixes: Under 2 seconds. Code changes drafted and ready for review. Would you like me to create the PR?" You review the generated code (25 minutes), verify it\'s correct, deploy to staging, test, deploy to production by 3:15 PM. GlobalCorp dashboard now loads in 1.8 seconds. Customer called at 4 PM: "Whatever you did, it\'s blazing fast now. Thank you!" Churn risk: eliminated.',
      didYouKnow: {
        show: true,
        insight: 'Performance issues cost SaaS companies an average of $140K per incident in churn risk and emergency engineering time. By diagnosing and fixing performance issues 5+ hours faster, you prevent customer frustration from escalating to executive-level churn conversations.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Proactive Performance Engineering & System Reliability',
        description: 'Build performance monitoring dashboards, establish SLAs, implement proactive optimization',
        expectedImpact: 'Prevents performance issues before customers notice, improves system reliability, builds trust'
      },
      additionalImpactQuestions: []
    }
  ],

  'Marketing Manager': (hourlyRate) => [
    {
      id: 1,
      title: 'Campaign Performance Analysis & Budget Reallocation',
      category: 'top5',
      baselineHours: 3.5,
      aiEnabledHours: 0.35,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 10.0,
      annualHoursFreed: 157.5,
      payrollFreed: 157.5 * hourlyRate,
      scenario: 'It\'s Monday morning. You spent $47K on marketing last week across Google Ads, LinkedIn, Facebook, content syndication, and a webinar. Your CMO Slacks: "What\'s our CAC by channel? Need to reallocate $20K this week to highest-performing channels. Can you send analysis by noon?" You have 3 hours and data is scattered across 6 platforms.',
      oldWay: 'Open Google Ads → Export campaign data to CSV → Open LinkedIn Campaign Manager → Export data → Facebook Ads Manager → Export → Webinar platform → Check attendance → HubSpot → Pull MQL data → Salesforce → Pull SQL and Closed Won data → Open massive Excel spreadsheet → Manually match leads to campaigns using UTM parameters (half the leads don\'t have UTMs...) → Calculate cost per lead, cost per MQL, cost per SQL, CAC for each channel → Build pivot tables → Create charts → Realize LinkedIn data is wrong (need to re-export) → Redo calculations → Finally done 3.5 hours later. You send the analysis at 1:47 PM (past the deadline). CMO responds: "Thanks, but I already reallocated budget based on my gut feeling this morning."',
      aiVoiceWay: 'You see the Slack at 9:02 AM. While walking to the kitchen, you say: "AIVA, analyze last week\'s marketing performance across all channels. Calculate CAC, cost per MQL, and ROI by channel. Recommend where to reallocate $20K for best results." By the time you sit down with coffee (5 minutes later), AIVA responds: "Spent $47K last week. 847 leads, 94 MQLs, 12 SQLs, 3 closed deals ($48K revenue). Best performing: LinkedIn ads—$89 CAC, 3.2x ROI. Worst: Facebook—$412 CAC, 0.8x ROI. Google Ads: improving—$156 CAC, moved from $210 last week. Webinar: strong—$67 CAC but limited scale. Recommendation: Reallocate $15K from Facebook to LinkedIn, $5K to scale webinar program. Expected impact: 40% more MQLs." You review the analysis (15 minutes), add context, and send to CMO at 9:22 AM. CMO responds: "Excellent analysis! Making the changes now." Budget reallocated by 10 AM instead of missing the deadline.',
      didYouKnow: {
        show: true,
        insight: 'Marketing teams that reallocate budget weekly based on performance data see 40-60% better ROI than those who "set and forget" campaigns. But weekly analysis is only sustainable with AI—otherwise teams burn out on reporting instead of strategy.'
      },
      valueAddedSuggestion: {
        hours: 3.15,
        activity: 'Strategic Campaign Development & Creative Innovation',
        description: 'Develop new campaign ideas, A/B test messaging, build content strategy, competitive positioning',
        expectedImpact: 'Increases campaign effectiveness 30-50%, accelerates time-to-market for new initiatives'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Did faster budget reallocation prevent wasted spend or improve campaign performance?',
          options: [
            { value: 'prevented_waste', label: 'Yes, caught and stopped underperforming campaign (saved $10K-$50K)', impact: 'high' },
            { value: 'better_roi', label: 'Yes, reallocated to better channels and increased MQL volume 30%+', impact: 'high' },
            { value: 'faster_decisions', label: 'Yes, we now optimize weekly instead of monthly', impact: 'medium' },
            { value: 'none', label: 'Still building the process', impact: 'none' }
          ]
        },
        {
          id: 'q2',
          question: 'Did others in your organization benefit from this analysis approach?',
          options: [
            { value: 'became_standard', label: 'Yes, became our standard weekly analysis process', impact: 'high' },
            { value: 'helped_team', label: 'Yes, other marketers now use this approach', impact: 'medium' },
            { value: 'influenced_strategy', label: 'Yes, CFO now trusts our budget recommendations', impact: 'medium' },
            { value: 'none', label: 'Just solved my immediate need', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Content Strategy Development with Competitive Intelligence',
      category: 'top5',
      baselineHours: 4.0,
      aiEnabledHours: 0.50,
      frequency: 'monthly',
      occurrencesPerYear: 12,
      timeMultiplier: 8.0,
      annualHoursFreed: 42,
      payrollFreed: 42 * hourlyRate,
      scenario: 'Your content calendar for Q2 is due next week. You need to create topics for 16 blog posts, 8 whitepapers, 4 webinars, and 50+ social media posts. The CEO wants content that "beats our competitors" but you don\'t have time to analyze what they\'re doing.',
      oldWay: 'Google "best B2B SaaS blog topics 2024" → Read 12 articles about content trends → Check competitor websites → Manually read through 40+ competitor blog posts → Take notes on topics → Check their social media → Screenshot interesting posts → Open BuzzSumo to find trending content → Manually compile a list of topic ideas → Check Google Trends for search volume → Use Ahrefs to check keyword difficulty → Build a spreadsheet with 50+ ideas → Categorize by buyer journey stage → Cross-reference with sales team feedback (schedule 3 meetings to ask what questions prospects are asking) → Prioritize topics → Map to content formats → Finally have a draft calendar. Takes 2 full days (16 hours), interrupted by 7 other urgent tasks.',
      aiVoiceWay: 'Monday morning, you say: "AIVA, analyze our top 5 competitors\' content from the last 3 months. Identify trending topics in our industry, gaps in our current content, and recommend 30 high-impact topics for Q2. Include search volume and competitive difficulty." In 30 minutes, AIVA provides: "Analyzed 347 competitor pieces. Trending topics: AI adoption strategies (12,000 searches/mo, low competition), ROI calculation tools (8,400 searches, medium competition), integration guides (6,200 searches, low competition). Gap: Competitors have 0 content on \'AI voice for sales teams\'—opportunity for thought leadership. Recommended topics: 30 specific titles ranked by SEO potential and differentiation. Suggested format: 12 blogs, 6 guides, 4 webinars, social posts. Content calendar draft ready." You spend 3 hours reviewing, customizing with your brand voice, and collaborating with your content writer. Calendar finalized and approved by Wednesday.',
      didYouKnow: {
        show: true,
        insight: 'Content that fills competitive gaps and targets high-intent keywords generates 4-7x more qualified leads than generic "best practices" content. But most marketers spend 80% of planning time on research instead of creative execution—AI flips that ratio.'
      },
      valueAddedSuggestion: {
        hours: 3.5,
        activity: 'Brand Strategy & Creative Storytelling',
        description: 'Develop unique brand positioning, create compelling narratives, build thought leadership',
        expectedImpact: 'Differentiates brand in crowded market, builds executive visibility, drives inbound interest'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Multi-Channel Attribution Reporting',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'monthly',
      occurrencesPerYear: 12,
      timeMultiplier: 8.3,
      annualHoursFreed: 26.4,
      payrollFreed: 26.4 * hourlyRate,
      scenario: 'Your CFO asks: "Which marketing channels are actually driving revenue? I need to see first-touch, last-touch, and multi-touch attribution for all closed deals this quarter. Finance needs this for budget planning next week." You know this data exists somewhere across HubSpot, Salesforce, Google Analytics, and your attribution tool (Bizible? HockeyStack?).',
      oldWay: 'Log into Salesforce → Export Closed Won opportunities → Open HubSpot → Try to match deals to original lead source → Half the deals have "Direct" as the source (not helpful) → Check Google Analytics for first-touch data → Export session data → Manually trace customer journeys → Open Bizible/attribution tool → Wait 10 minutes for report to load → Export data → Merge 4 different CSV files in Excel → Manually clean data (fix duplicates, standardize channel names) → Build pivot tables for first-touch, last-touch, multi-touch models → Realize some deals are missing → Go back and manually trace them → Build charts for CFO → Takes 2.5 hours and you\'re still not confident the data is 100% accurate.',
      aiVoiceWay: 'CFO sends the request. While in your 1:1 with your content manager, you say to AIVA: "Create multi-touch attribution report for all closed deals this quarter. Include first-touch, last-touch, and time-decay models. Show revenue by channel." AIVA responds in 18 minutes: "82 closed deals, $1.2M revenue. First-touch attribution: Organic search 38%, LinkedIn ads 24%, direct 18%, webinars 12%, referrals 8%. Last-touch: Demo requests 42%, email nurture 28%, LinkedIn 15%, webinars 10%, other 5%. Multi-touch time-decay: LinkedIn ads influenced 67 deals averaging 4.2 touchpoints, organic search influenced 71 deals averaging 6.8 touchpoints. Full report with deal-level breakdown ready." You review, add executive summary, send to CFO in 20 minutes. CFO response: "This is incredibly helpful—can we get this monthly?"',
      didYouKnow: {
        show: true,
        insight: 'Companies with clear attribution data make 3x better budget allocation decisions and see 40% higher marketing ROI. But building attribution reports manually is so painful that most teams only do it quarterly (or never)—AI makes it effortless to do weekly or even daily.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic Growth Experimentation',
        description: 'Design and run high-impact growth experiments, test new channels, optimize conversion funnels',
        expectedImpact: 'Discovers new growth channels, accelerates learning velocity, drives breakthrough results'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Marketing Automation Workflow Optimization',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per campaign',
      occurrencesPerYear: 30,
      timeMultiplier: 8.3,
      annualHoursFreed: 66,
      payrollFreed: 66 * hourlyRate,
      scenario: 'You\'re launching a new lead nurture campaign next week. You need to set up: email sequence (7 emails), lead scoring rules, segmentation logic, A/B tests, conversion tracking, and integration with Salesforce. Your marketing automation platform (HubSpot, Marketo, Pardot) has 1,000 settings and you need to configure everything correctly or leads will fall through the cracks.',
      oldWay: 'Open HubSpot workflow builder → Create new workflow → Configure trigger: "When lead downloads whitepaper" → Set up segmentation: If company size > 200, send to enterprise sequence; if <200, send to SMB sequence → Realize you need to create 2 separate workflows → Build both workflows → Now create 7 email templates → Write email copy → Add personalization tokens → Preview emails (half the tokens show errors) → Fix tokens → Set up A/B test: Test subject lines on first email → Configure test settings → Set timing: Email 1 immediate, Email 2 after 2 days, Email 3 after 5 days... → Set up lead scoring: +10 for email open, +25 for link click, +50 for demo request → Configure Salesforce sync → Test workflow with test leads → Find 3 configuration errors → Fix errors → Re-test → Finally ready to launch. Total: 2.5 hours, and you\'re not 100% confident it will work correctly.',
      aiVoiceWay: 'Thursday afternoon, you say: "AIVA, create a lead nurture workflow for our new whitepaper campaign. Set up email sequence, segmentation by company size, lead scoring, A/B testing on first email, and Salesforce sync. Launch Monday." In 20 minutes, AIVA provides: "Lead nurture campaign created: Trigger: Whitepaper download. Segmentation: Enterprise (200+ employees) gets sequence A with ROI focus, SMB (<200) gets sequence B with ease-of-use focus. 7 emails drafted with personalization for each segment. A/B test on Email 1: Subject line A: \'3 ways [Company] can reduce costs 40%\', Subject line B: \'[First Name], see how companies like yours save $200K/year\'. Lead scoring configured: Email open +10, link click +25, demo request +50, pricing page visit +30. Salesforce sync: New leads create contacts, qualified leads create opportunities, scores sync to lead score field. Workflow tested with 15 test scenarios—all pass. Ready to activate Monday. Timeline: Email 1 (immediate), Email 2 (day 3), Email 3 (day 7), Email 4 (day 14), Email 5 (day 21), Email 6 (day 30), Email 7 (day 45). Should I activate?" You review (15 minutes), make minor copy adjustments, activate. Campaign launched successfully Monday. Leads flowing correctly.',
      didYouKnow: {
        show: true,
        insight: 'Marketing automation workflows set up incorrectly can lose 30-50% of leads due to segmentation errors or broken triggers. But configuring workflows manually takes so long that many marketers skip testing—AI builds AND tests workflows, ensuring nothing breaks.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Conversion Rate Optimization & Funnel Analysis',
        description: 'Analyze drop-off points, run landing page experiments, optimize email engagement',
        expectedImpact: 'Increases conversion rates 25-40%, maximizes ROI from existing traffic'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Competitive Positioning & Messaging Development',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'per major campaign',
      occurrencesPerYear: 12,
      timeMultiplier: 7.5,
      annualHoursFreed: 31.2,
      payrollFreed: 31.2 * hourlyRate,
      scenario: 'Your company is launching a new product line next quarter. Your CEO says: "We need messaging that differentiates us from competitors. I want to own the conversation in our category. What should our positioning be?" You have 3 weeks to develop positioning, messaging framework, and campaign creative.',
      oldWay: 'Research competitors → Visit 8 competitor websites → Read their messaging → Download their whitepapers → Attend their webinars (schedule 3 webinars over 2 weeks) → Take notes on positioning → Analyze customer reviews to understand buyer priorities → Interview 10 customers: "Why did you choose us?" → Schedule interviews (takes a week to get everyone) → Synthesize feedback → Identify differentiation themes → Draft positioning statement → Test with sales team → Sales says "This doesn\'t address the main objection we hear" → Revise → Test with 3 customers → Mixed feedback → Revise again → Build messaging framework: value props, differentiators, proof points → Write sample messaging for website, ads, emails → Present to leadership → CEO says "Feels generic—what makes us truly different?" → Back to drawing board. Total time: 12+ hours over 3 weeks.',
      aiVoiceWay: 'Monday morning, CEO makes request. You say: "AIVA, analyze competitive landscape and recommend positioning strategy for our new product line. Include competitor messaging analysis, customer buying criteria, differentiation opportunities, and draft messaging framework." In 45 minutes, AIVA provides: "Competitive positioning analysis: 8 major competitors analyzed. Competitor A positions on \'ease of use\', Competitor B on \'enterprise features\', Competitor C on \'AI capabilities\'. Customer research (analyzed 127 reviews + 34 customer interviews): Top buying criteria: 1) Integration capabilities (mentioned by 67% of buyers), 2) Time to value (45%), 3) Support quality (38%), 4) Security/compliance (34%). Your unique strengths vs competitors: Only solution with native integrations to 50+ tools (competitors have 10-20), fastest implementation (2 weeks vs 6-8 weeks), 24/7 support included (competitors charge extra). Recommended positioning: \'The Integration-First Platform That Gets You Live in 2 Weeks.\' Messaging framework: Value prop: Integrate everything, go live fast. Key messages: 50+ native integrations, 2-week implementation, 24/7 support, enterprise security. Proof points: Average customer live in 12 days, 98% integration success rate, 4.8/5 customer satisfaction. Sample messaging for website, ads, email sequences ready. Competitive win themes included." You review (1 hour), refine with creative team, test with 3 customers (they love it), present to CEO Wednesday. CEO: "This is exactly what we needed. Let\'s run with it."',
      didYouKnow: {
        show: true,
        insight: 'Companies with clear, differentiated positioning see 2.4x higher conversion rates and 50% shorter sales cycles than those with generic messaging. But developing positioning through traditional methods takes so long that many companies launch with weak messaging—AI compresses months of research into hours.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Brand Strategy & Market Category Creation',
        description: 'Define new market category, build thought leadership, establish brand as industry leader',
        expectedImpact: 'Creates lasting competitive advantage, commands premium pricing, attracts top talent'
      },
      additionalImpactQuestions: []
    }
  ],

  'HR Manager': (hourlyRate) => [
    {
      id: 1,
      title: 'Candidate Screening & Interview Coordination',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.35,
      frequency: 'per open role',
      occurrencesPerYear: 40,
      timeMultiplier: 8.6,
      annualHoursFreed: 106,
      payrollFreed: 106 * hourlyRate,
      scenario: 'You have 5 open positions: 2 engineers, 1 sales rep, 1 marketing manager, 1 customer success manager. In the last week, you received 284 applications. Your hiring managers are asking: "Where are the candidates? I need to start interviews next week!" You haven\'t even looked at 80% of the applications.',
      oldWay: 'Open Greenhouse (or Lever, Workday) → Filter applications by role → Open each candidate profile individually → Read resume → Check for required skills → Search LinkedIn to verify experience → Check for culture fit signals → Rate candidate → Take notes → Repeat for 284 applications → After 3 hours, you\'ve reviewed maybe 60 candidates → Email hiring managers with top 5 per role → Hiring managers respond: "These don\'t match what I need—can you find candidates with X skill?" → Go back and re-screen → Finally identify 15 strong candidates → Now manually coordinate interview schedules: Check hiring manager calendars → Email candidates with availability → Wait for responses → Send calendar invites → 3 candidates ghost you → Start over. The whole process takes a week.',
      aiVoiceWay: 'Monday morning, you say: "AIVA, screen the 284 new applications against job requirements. Rank candidates by fit, highlight any red flags, and identify top 5 per role." In 20 minutes, AIVA responds: "Screened all 284 applications. Engineering role 1: 5 strong candidates with React + Node.js experience, 3 have distributed systems experience you requested. Red flag: 12 candidates have no experience listed—removed. Sales role: 4 candidates with SaaS sales and quota attainment, 2 have experience in our ICP. Marketing role: 3 candidates with B2B demand gen, all have metrics-driven results. CS role: 5 candidates with enterprise SaaS CS experience. Top candidates contacted via email. Should I coordinate interview schedules?" You say "Yes." AIVA sends templated emails with interview scheduling links. By end of day Monday, 12 candidates are scheduled for interviews Tuesday-Thursday. Hiring managers: impressed.',
      productivityImpact: `Traditional Method:
• Resume and job description review: 15-20 minutes per candidate
• Screening 284 candidates: 70-90 hours total
• Interview coordination: 10-15 hours
• Total time per hiring cycle: 80-105 hours

AIVA Method:
• Automated screening with AI analysis: 20 minutes for all 284 candidates
• Interview coordination (automated): 5 minutes
• Total time per hiring cycle: 25 minutes

Productivity Multiplier: 200x+ faster for candidate screening
Annual Time Calculation: 40 hiring cycles × 100 hours saved = 4,000 hours freed annually per HR team`,

      emotionalImpact: `Hiring mistakes—especially executive hires—cost $200K-$500K+ in severance, lost productivity, and rehire costs. Every screening decision carries weight: "Am I missing a great candidate? Am I recommending someone who'll fail?"

This anxiety manifests as Sunday night dread before Monday's resume review marathon. You second-guess your assessments, worry about hiring manager disappointment, and fear recommending candidates who'll underperform. Recruiting is one of the top 3 sources of HR stress—the fear of getting critical hires wrong.

AIVA transforms this entirely. When AI screens 284 candidates in 20 minutes with consistent criteria, you're not anxious about missing someone—you're confident the best candidates surfaced. When hiring managers get qualified candidates fast, you're not defensive—you're proactive.

HR professionals using AI screening report:
• 70% reduction in hiring decision anxiety
• 60% reduction in hiring manager conflict over candidate quality
• Elimination of weekend resume review sessions
• Measurable improvement in hiring confidence and job satisfaction

This isn't minor quality-of-life improvement. This is the difference between sustainable recruiting leadership and burnout from constant hiring pressure.`,

      businessROI: `Hire Quality Improvement:
Improving hire quality by just 15% (reducing mis-hires from 1-in-5 to 1-in-6) prevents $150K-$400K annually in turnover costs.

Failed hire costs:
Direct costs:
• Severance/termination: $30K-$60K
• Recruiting fees for replacement: $25K-$40K
• Training/onboarding costs lost: $10K-$20K
Total direct: $65K-$120K per failed hire

Indirect costs:
• Lost productivity during 3-6 months in role: $40K-$100K
• Team disruption and knowledge gaps: $20K-$50K
• Manager time spent on performance issues: $10K-$25K
Total indirect: $70K-$175K per failed hire

Total cost per failed hire: $135K-$295K

Time-to-Fill Acceleration:
Faster screening reduces time-to-fill by 35-40%, from 45 days to 28 days.

For critical revenue-generating roles:
• Sales rep generating $500K-$800K annually
• 17-day acceleration = 3 weeks of additional productivity
• Revenue impact: $30K-$45K per accelerated hire

For organizations hiring 40-60 people annually: $300K-$900K in combined quality improvement and time-to-fill acceleration.`,

      didYouKnow: {
        show: true,
        insight: 'Time-to-hire directly impacts quality of hire—top candidates accept offers within 10 days, but average company takes 42 days to extend offers. By screening 284 candidates in 20 minutes instead of 1 week, you move 10x faster and win the best talent.'
      },
      valueAddedSuggestion: {
        hours: 2.65,
        activity: 'Strategic Talent Planning & Employer Branding',
        description: 'Build talent pipelines, develop employer brand, create candidate experience strategies',
        expectedImpact: 'Reduces time-to-hire 50%, improves offer acceptance rate 30-40%, attracts passive candidates'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Has faster candidate screening improved hiring outcomes?',
          options: [
            { value: 'faster_fills', label: 'Yes, we fill roles 2-4 weeks faster', impact: 'high' },
            { value: 'better_quality', label: 'Yes, we hire better-quality candidates', impact: 'high' },
            { value: 'better_experience', label: 'Yes, candidate experience has improved significantly', impact: 'medium' },
            { value: 'none', label: 'Still measuring', impact: 'none' }
          ]
        },
        {
          id: 'q2',
          question: 'Did this screening approach benefit your organization beyond filling these specific roles?',
          options: [
            { value: 'became_standard', label: 'Yes, became our standard screening process across all roles', impact: 'high' },
            { value: 'trained_team', label: 'Yes, trained recruiting team on better assessment criteria', impact: 'medium' },
            { value: 'improved_manager_trust', label: 'Yes, hiring managers now trust our candidate quality', impact: 'medium' },
            { value: 'none', label: 'Just filled these specific roles', impact: 'none' }
          ]
        }
      ],
      additionalRippleEffects: `The direct calculation shows ${(106 * hourlyRate).toFixed(0)} in payroll freed. But here's what the numbers can't fully capture:

**Downstream Hiring Quality Effects:**
When candidate screening improves, you don't just fill roles faster—you fill them with better people. Better hires stay longer (18-month average tenure becomes 36+ months), perform better (20-30% higher productivity in first year), and refer more quality candidates (2-3x more employee referrals).

One great hire in a leadership role influences 5-15 other roles through team building, culture setting, and organizational standards. Over 24 months, that single improved hire decision compounds into $80K-$200K in prevented turnover and team performance improvement.

**Knowledge Multiplication Across Recruiting Team:**
Your AI-enhanced screening approach doesn't stay with you. When you demonstrate consistent, high-quality candidate identification, your recruiting team adopts the methodology. Your recruiting coordinator asks: "How are you screening so effectively?" You share the structured criteria approach.

Your 106 hours of time freed becomes 250-400 hours of improved recruiting team effectiveness as they apply better assessment frameworks to all roles—not just the ones you personally screen.

**Hiring Manager Confidence & Reduced Conflict:**
Better, faster candidate delivery transforms your relationship with hiring managers. Instead of weekly "Where are my candidates?" pressure, hiring managers start asking "How do you find such good people so quickly?"

This trust reduces time spent on defensive explanations, candidate re-screening, and relationship repair by 40-60% (12-18 hours per quarter = 48-72 hours annually). You shift from reactive justification to proactive talent advisory.

Conservative additional impact: $200K-$500K over 24 months beyond direct payroll freed.`,

      compoundingEffect: `When you reallocate 106 hours to strategic talent planning and employer branding, the ROI doesn't add—it multiplies:

→ Better talent pipelines → Faster fills → More time for employer brand development
→ Better employer brand → More inbound candidates → Less reactive sourcing → More time for pipeline building
→ Better pipeline → Higher quality hires → Stronger teams → Better employer reputation → More referrals

This creates a virtuous cycle where each hour invested in strategic recruiting generates 1.5-2 hours of time freed in future quarters through:
• 25-35% reduction in time-to-fill (less urgent scrambling)
• 40-50% increase in inbound applications (less sourcing effort)
• 30-40% improvement in offer acceptance (less re-recruiting)

Total value of strategic reallocation: $300K-$750K annually beyond direct productivity gains, compounding at 15-20% annually as talent brand and pipelines mature.`
    },
    {
      id: 2,
      title: 'Employee Relations Issue Investigation & Policy Guidance',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per incident',
      occurrencesPerYear: 60,
      timeMultiplier: 8.3,
      annualHoursFreed: 132,
      payrollFreed: 132 * hourlyRate,
      scenario: 'A manager Slacks you at 9:47 AM: "One of my team members just filed a complaint about another employee. Says they feel harassed. I need guidance on how to handle this—what do I do?" You were about to start a completely different task, and now you need to drop everything and figure out the right protocol, fast.',
      oldWay: 'Search your email for "harassment policy" → Can\'t find it → Check the shared drive → Find the employee handbook → Read through 47-page PDF → Find harassment policy on page 32 → Not specific enough for this situation → Search for "harassment investigation best practices" → Read 4 articles → Check your state\'s employment law requirements → Look up EEOC guidelines → Try to remember training from 2 years ago → Call your employment lawyer ($350/hour consultation) → They say "Document everything and follow your policy" (not super helpful) → Draft investigation plan → Review similar past cases in your files → Create interview questions → Email manager with guidance. 2.5 hours later, you\'re ready to advise the manager, but the employee has now escalated to the CEO.',
      aiVoiceWay: 'You see the urgent Slack. While walking to a private conference room, you say: "AIVA, what\'s our protocol for investigating a harassment complaint? Include legal requirements, investigation steps, documentation needs, and timeline." In 30 seconds, AIVA responds: "California harassment investigation protocol: 1) Immediately separate employees if needed, 2) Begin investigation within 24 hours, 3) Interview complainant, accused, and witnesses separately, 4) Document everything in writing, 5) Determine credibility and findings, 6) Take appropriate action, 7) Follow up with complainant. Legal requirement: Must complete investigation within 30 days. Template investigation plan and interview questions available. Past similar case: Case ID 2023-04, resolved in 18 days with mediation. Would you like me to draft the investigation plan and notify legal team?" You say "Yes." You call the manager at 9:52 AM (5 minutes later) with clear guidance. Investigation begins within 1 hour. Issue handled properly, employee feels heard, legal risk minimized.',
      didYouKnow: {
        show: true,
        insight: 'Employment-related lawsuits cost companies an average of $125,000-$500,000 in legal fees and settlements. Responding to complaints within 1 hour instead of 2.5 hours demonstrates seriousness and can prevent escalation to legal action.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Proactive Culture Development & Conflict Prevention',
        description: 'Build conflict resolution training, improve manager capabilities, create positive culture initiatives',
        expectedImpact: 'Reduces HR incidents by 50-70%, improves employee satisfaction and retention'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Did faster response prevent the issue from escalating or causing legal exposure?',
          options: [
            { value: 'prevented_lawsuit', label: 'Yes, prevented potential lawsuit ($125K-$500K legal exposure)', impact: 'high' },
            { value: 'prevented_escalation', label: 'Yes, resolved before reaching CEO or legal team', impact: 'high' },
            { value: 'protected_culture', label: 'Yes, demonstrated quick action and protected team morale', impact: 'medium' },
            { value: 'none', label: 'Followed process, no additional prevention', impact: 'none' }
          ]
        },
        {
          id: 'q2',
          question: 'Did this approach benefit your organization beyond this single incident?',
          options: [
            { value: 'became_standard', label: 'Yes, became our new HR response protocol', impact: 'high' },
            { value: 'trained_managers', label: 'Yes, trained other managers on this process', impact: 'medium' },
            { value: 'improved_confidence', label: 'Yes, managers now feel more confident handling issues', impact: 'medium' },
            { value: 'none', label: 'Just resolved this one situation', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Compensation Benchmarking & Offer Preparation',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per offer',
      occurrencesPerYear: 50,
      timeMultiplier: 8.0,
      annualHoursFreed: 87.5,
      payrollFreed: 87.5 * hourlyRate,
      scenario: 'Your hiring manager wants to extend an offer to a Senior Software Engineer in San Francisco. Asks: "What should we offer? The candidate is expecting $180K-$200K base. What\'s competitive? How does this compare to our other engineers? Can we afford it?" You need an answer by end of day to move fast before the candidate accepts another offer.',
      oldWay: 'Open your compensation spreadsheet → Find current engineers\' salaries → Realize data is 6 months old → Check Radford or Mercer comp survey → Search for "Senior Software Engineer, San Francisco" → See range: $160K-$210K (not specific enough) → Check Glassdoor → See different numbers → Check levels.fyi → See totally different numbers → Try to figure out which data source is most accurate → Manually calculate internal equity (compare to similar roles) → Check budget constraints with Finance → Build a detailed offer proposal with base, bonus, equity → Realize you need to calculate equity value → Look up current stock price and vesting schedule → Draft offer letter → Send to hiring manager → They ask: "Can we go higher? Candidate has another offer." → Redo calculations. Takes 2 hours, and by the time you send the offer, the candidate accepted the other company.',
      aiVoiceWay: 'Hiring manager Slacks the request at 2:18 PM. While walking to your next meeting, you say: "AIVA, create a compensation offer for Senior Software Engineer in San Francisco. Candidate expects $180K-$200K. Compare to market data and internal equity. Include base, bonus, and equity breakdown." By 2:30 PM (12 minutes later), AIVA responds: "Market data for Senior SWE in SF: 75th percentile is $195K base + 15% target bonus + $60K equity annually. Internal equity check: Your 3 current Senior SWEs earn $175K-$188K base (hired 18 months ago, market has increased 8%). Recommendation: Offer $190K base + 15% bonus + $240K equity (4-year vest). Total comp: $265K/year, competitive for top talent. Budget impact: Within approved headcount budget. Draft offer letter ready with all terms." You review, get Finance approval in 5 minutes, send to hiring manager at 2:45 PM. Offer extended at 3:00 PM. Candidate accepts same day.',
      didYouKnow: {
        show: true,
        insight: 'Speed matters in competitive talent markets—candidates with multiple offers make decisions within 24-48 hours. Being able to extend competitive, well-researched offers in 15 minutes instead of 2 hours can be the difference between accepting and losing top talent.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Strategic Compensation Design & Retention Programs',
        description: 'Build career leveling frameworks, design equity programs, create retention strategies',
        expectedImpact: 'Improves pay equity, reduces turnover by 30-50%, attracts higher-quality candidates'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Performance Review Cycle Coordination',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.35,
      frequency: 'semi-annual',
      occurrencesPerYear: 2,
      timeMultiplier: 8.6,
      annualHoursFreed: 5.3,
      payrollFreed: 5.3 * hourlyRate,
      scenario: 'Semi-annual performance review season starts next week. You have 87 employees across 12 managers. You need to: send review templates, track completion, ensure calibration, process salary adjustments, update HRIS, and communicate outcomes. Your CEO wants this done in 3 weeks but it usually takes 6 weeks and everyone hates the process.',
      oldWay: 'Email all managers with review templates → Wait for managers to complete reviews (chase them down 3 times over 2 weeks) → Only 60% submit on time → Follow up individually with late managers → Finally receive all reviews → Read through 87 reviews to check for completion → Find 23 reviews that are incomplete or just say "Good job" (not helpful) → Send back for revision → Schedule calibration meetings (takes a week to coordinate 12 managers) → Facilitate 4 hours of calibration meetings → Manually track rating distributions in Excel → Calculate salary increase budget → Some managers want 10% raises, others 2%—doesn\'t match budget → Negotiate with managers → Manually input all salary changes into HRIS → Generate offer letters → Email employees → Field 40+ questions from confused employees → Finally done 7 weeks later, everyone exhausted.',
      aiVoiceWay: 'Two weeks before review season, you say: "AIVA, orchestrate the semi-annual performance review cycle for 87 employees. Track completion, flag incomplete reviews, calculate salary adjustment budget within constraints, coordinate calibration, and automate communications." Over the next 3 weeks, AIVA manages the process: "Week 1: Review templates sent to 12 managers with reminders scheduled. Week 2: 8 managers completed (67%), 4 reminded daily—all completed by Friday. Reviews analyzed: 11 reviews flagged as low-quality (insufficient detail)—managers notified with specific feedback. Week 3: Calibration meetings auto-scheduled. Rating distribution: 18% exceeds expectations, 72% meets, 10% below (healthy distribution). Salary increases calculated within $180K budget: Average 4.2% increase, top performers get 8-10%, solid performers 3-5%, underperformers 0-2%. All calculations respect internal equity guidelines. HRIS updated with new salaries, effective June 1. Offer letters generated and sent. Employee FAQ auto-responder handling common questions. Process completed in 3 weeks (vs typical 7 weeks). Manager feedback: \'Smoothest review cycle ever.\' Employee questions reduced 60% due to clear communications."',
      didYouKnow: {
        show: true,
        insight: 'Companies that complete performance reviews in 3 weeks instead of 6-8 weeks have 2.5x higher employee satisfaction with the process because employees get clarity and salary increases faster. But coordinating 87 reviews manually is so painful that most HR teams dread review season—AI makes it manageable.'
      },
      valueAddedSuggestion: {
        hours: 2.65,
        activity: 'Strategic Performance Management System Design',
        description: 'Build continuous feedback culture, implement OKRs, develop manager coaching programs',
        expectedImpact: 'Shifts from annual reviews to ongoing development, improves performance 25-40%'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Employee Onboarding Program Optimization',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per new hire',
      occurrencesPerYear: 50,
      timeMultiplier: 8.3,
      annualHoursFreed: 110,
      payrollFreed: 110 * hourlyRate,
      scenario: 'New engineer starts Monday. You need to coordinate: IT equipment setup, system access (Slack, Gmail, GitHub, AWS, 12 other tools), introduce them to their team, schedule 1:1s with 8 people, create onboarding checklist, book training sessions, and make sure they feel welcomed. You have 3 days to prepare everything and you just found out about this hire yesterday (recruiter forgot to tell you).',
      oldWay: 'Email IT: "New hire Monday, needs laptop, monitors, keyboard" → Wait for confirmation → Create accounts: Open IT admin panel → Create Google Workspace account → Add to Slack → Add to GitHub organization → Request AWS access from DevOps → Realize you need to add them to 12 other tools → Manually create accounts or submit access requests for each one → Email manager: "Who should they meet in first week?" → Manager says "Everyone on the team, plus people from product, design, and ops" → Manually check calendars for 15 people → Send 15 meeting requests → Half decline due to conflicts → Reschedule → Create onboarding doc: First day: HR orientation 9 AM, IT setup 10 AM, meet manager 11 AM... → Realize you forgot to book a desk for them → Email facilities → Desk isn\'t ready → Scramble to find temporary desk. Total chaos, takes 2.5 hours, and on Monday the new hire shows up but half their accounts aren\'t ready yet. First impression: not great.',
      aiVoiceWay: 'Thursday afternoon, recruiter tells you about Monday start. You say: "AIVA, prepare onboarding for new software engineer starting Monday. Name is Alex Chen, role is Senior Backend Engineer, reports to Sarah. Coordinate IT setup, system access, meeting introductions, and create onboarding schedule." In 20 minutes, AIVA completes: "Onboarding prepared for Alex Chen: IT equipment ordered (laptop, monitors, accessories arriving Friday). System access: Created accounts for Google Workspace, Slack, GitHub, JIRA, Figma, AWS, DataDog, Confluence, Notion, 1Password, Zoom, Calendar. All access configured with appropriate permissions for Senior Backend Engineer role. Meeting schedule: Monday 9 AM HR orientation with you, 10 AM IT setup, 11 AM manager 1:1 with Sarah, 12 PM team lunch (calendar invite sent to 6 team members), 2 PM engineering onboarding (tech stack overview), 3 PM codebase walkthrough. Days 2-5: 1:1 meetings scheduled with 8 key people across engineering, product, and ops (all accepted). Desk F-42 reserved. Welcome email sent to Alex with Monday schedule. Onboarding checklist created (47 items tracked). Everything ready." Monday morning: Alex arrives, everything works perfectly, feels welcomed and productive from day 1. Manager feedback: "Best onboarding experience we\'ve ever delivered."',
      didYouKnow: {
        show: true,
        insight: 'New hires who have smooth, well-coordinated onboarding are 3.5x more likely to be high performers after 6 months and 2.1x more likely to stay beyond 2 years. But coordinating onboarding for each hire manually takes so long that most companies deliver mediocre experiences—AI makes exceptional onboarding scalable.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'New Hire Mentorship & First-90-Days Excellence',
        description: 'Personally mentor new hires, ensure strong starts, build connection to company culture',
        expectedImpact: 'Accelerates time-to-productivity by 40%, builds strong culture, reduces early-tenure turnover'
      },
      additionalImpactQuestions: []
    }
  ],

  'Financial Analyst': (hourlyRate) => [
    {
      id: 1,
      title: 'Variance Analysis & Executive Reporting',
      category: 'top5',
      baselineHours: 4.0,
      aiEnabledHours: 0.45,
      frequency: 'monthly',
      occurrencesPerYear: 12,
      timeMultiplier: 8.9,
      annualHoursFreed: 42.6,
      payrollFreed: 42.6 * hourlyRate,
      scenario: 'It\'s the 3rd business day of the month. Your CFO needs the monthly variance analysis by noon for the executive team meeting. You need to compare actuals vs budget across 12 departments, 40+ cost centers, and explain every variance over $10K. The data is scattered across NetSuite, your ERP system, departmental spreadsheets, and HR systems.',
      oldWay: 'Export actuals from NetSuite → Takes 15 minutes to run the report → Export budget data from your master budget file → Realize engineering submitted an updated forecast last week that\'s not in the budget file → Track down the engineering manager → Get updated numbers → Merge actuals and budget in Excel → Build variance calculations (absolute and percentage) → Sort by largest variances → Now the hard part: figure out WHY each variance exists → Slack 12 department heads: "Why did you overspend on X?" → Wait for responses → Only 6 respond → Chase down the other 6 → Get conflicting explanations → Verify with supporting data → Build narrative for each major variance → Create executive summary → Format charts → Double-check all formulas. Finally done at 1:47 PM—almost 2 hours late.',
      aiVoiceWay: 'Morning of the 3rd, while making coffee, you say: "AIVA, create the monthly variance analysis report. Compare actuals vs budget, identify all variances over $10K, and explain the drivers." In 30 minutes, AIVA provides: "Total company: $420K over budget (8.2%). Largest variances: Engineering overspent $180K (12%)—due to 3 unplanned senior engineer hires in September. Sales underspent $95K (15%)—due to delayed conference that moved to next month. Marketing overspent $67K (22%)—new LinkedIn campaign launched mid-month. Operations on budget. HR overspent $42K—annual compliance training moved from Q4. G&A underspent $23K—legal fees lower than expected. Executive summary, detailed variance tables, and charts ready." You review, add context where needed (15 minutes), and send to CFO at 10:02 AM. CFO response: "Perfect, thank you. Let\'s use this format going forward."',
      didYouKnow: {
        show: true,
        insight: 'CFOs who receive variance analysis within 3 days of month close (instead of 5-10 days) can make corrective actions 2-3 weeks earlier, preventing budget overruns from compounding. Speed of financial insights directly drives better business decisions.'
      },
      valueAddedSuggestion: {
        hours: 3.55,
        activity: 'Strategic Financial Planning & Business Partnering',
        description: 'Build predictive models, conduct scenario analysis, advise department heads on strategic decisions',
        expectedImpact: 'Becomes trusted business partner, drives 15-25% better budget accuracy, identifies growth opportunities'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Has faster variance analysis improved budget management?',
          options: [
            { value: 'prevented_overruns', label: 'Yes, caught and prevented budget overruns earlier', impact: 'high' },
            { value: 'better_decisions', label: 'Yes, executives make faster reallocation decisions', impact: 'high' },
            { value: 'improved_forecast', label: 'Yes, improved forecast accuracy', impact: 'medium' },
            { value: 'none', label: 'Still measuring', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Budget vs Actuals Reconciliation',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.35,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 8.6,
      annualHoursFreed: 132.5,
      payrollFreed: 132.5 * hourlyRate,
      scenario: 'Friday afternoon. Your VP of Operations says: "I need to know if we\'re on track for Q4 budget. Can you send me where we stand vs plan for my department?" You know this means pulling data from 6 different systems and reconciling 200+ line items.',
      oldWay: 'Open your master budget file → Export actuals from NetSuite (filter by Operations cost centers) → Copy into Excel → Manually match account codes (some don\'t match because IT changed the chart of accounts last month) → Spend 20 minutes fixing mismatches → Calculate month-to-date, quarter-to-date figures → Compare to budget → Calculate remaining budget → Identify categories that are over/under → Cross-check with AP aging report (some bills haven\'t been entered yet) → Adjust for accruals → Realize payroll data is in a separate system → Pull HRIS data → Add to spreadsheet → Format report → Send to VP. Done at 6:47 PM—there goes your Friday evening.',
      aiVoiceWay: 'Friday at 3:15 PM, the VP sends the request. While packing your laptop to leave, you say: "AIVA, create budget vs actuals report for Operations, Q4 to date. Include remaining budget by category and flag any areas over 90% spent." In 20 minutes, AIVA responds: "Operations Q4 budget: $840K. Spent to date: $587K (70%). Remaining: $253K. Categories over 90%: Cloud infrastructure at 94% ($47K remaining for 6 weeks—trending to overspend $23K). Facilities at 91% ($18K remaining). Payroll on track at 68%. Software licenses under budget at 62%. Contractor costs at 78%. Alert: Cloud infrastructure trending over budget due to increased usage from new product launch. Recommend $30K reallocation from software licenses. Full report ready." You review (10 minutes), send to VP at 3:45 PM. VP response: "Thanks! Let\'s discuss cloud budget reallocation Monday." You leave work at 4:00 PM. Weekend: saved.',
      didYouKnow: {
        show: true,
        insight: 'Finance teams that provide weekly budget updates instead of monthly help department heads stay within budget 3x more effectively. But weekly reporting is only sustainable with AI automation—otherwise analysts burn out on repetitive reporting.'
      },
      valueAddedSuggestion: {
        hours: 2.65,
        activity: 'Financial Process Optimization & Automation',
        description: 'Build dashboards, automate routine reports, improve data accuracy, reduce manual work',
        expectedImpact: 'Reduces close cycle time by 40%, improves data accuracy, frees team for strategic work'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Financial Model Scenario Building',
      category: 'top5',
      baselineHours: 5.0,
      aiEnabledHours: 0.60,
      frequency: 'per major decision',
      occurrencesPerYear: 20,
      timeMultiplier: 8.3,
      annualHoursFreed: 88,
      payrollFreed: 88 * hourlyRate,
      scenario: 'Your CEO asks: "What if we hire 10 more sales reps in Q1? Model out the revenue impact, cost, payback period, and cash flow implications for the next 18 months. Need this for the board meeting Thursday." It\'s Monday afternoon.',
      oldWay: 'Open your financial model (massive Excel file with 30+ tabs) → Add 10 sales reps to headcount assumptions → Manually update salary, bonus, benefits, taxes for each rep → Calculate ramp time (3 months to productivity) → Estimate quota attainment (assume 85%) → Calculate expected revenue based on ramp schedule → Realize you need to account for increased marketing spend to generate enough leads → Adjust marketing budget → Update CAC assumptions → Recalculate LTV:CAC ratio → Check cash flow impact (upfront costs before revenue) → Build 3 scenarios: pessimistic (70% quota), base case (85%), optimistic (95%) → Realize you forgot to account for increased customer success costs → Add CS headcount → Recalculate → Check all formulas (find 2 errors) → Fix errors → Create charts for board deck → Format everything → QA the entire model. Takes 5 hours over Monday and Tuesday.',
      aiVoiceWay: 'CEO sends the request Monday at 2 PM. While walking to grab a snack, you say: "AIVA, model the financial impact of hiring 10 sales reps in Q1. Include 18-month revenue forecast, costs, payback period, and cash flow. Build conservative, base, and optimistic scenarios." By Tuesday morning, AIVA provides: "10 sales reps hired in Q1: Total cost $1.8M over 18 months (salary, benefits, taxes). Revenue impact with 3-month ramp: $4.2M (optimistic), $3.1M (base case), $2.4M (conservative). Payback period: 14 months (base case). Additional costs: +2 CS reps needed ($280K), +15% marketing budget ($180K). LTV:CAC remains healthy at 3.2:1. Cash flow: -$320K in Q1, -$180K in Q2, breakeven Q3, positive thereafter. Base case IRR: 37%. Scenario comparison charts and board deck slides ready." You review (45 minutes), validate assumptions, customize for your CEO\'s preferences. Present to CEO Tuesday afternoon. CEO: "This is exactly what I needed. Great work."',
      didYouKnow: {
        show: true,
        insight: 'Companies that can model strategic scenarios in hours instead of days make 5-10x more data-driven decisions per year. Speed of analysis directly correlates with quality of strategic planning—fast finance teams become true strategic partners.'
      },
      valueAddedSuggestion: {
        hours: 4.4,
        activity: 'Strategic Business Advisory & Investment Analysis',
        description: 'Evaluate M&A opportunities, assess new business models, conduct competitive financial analysis',
        expectedImpact: 'Influences major strategic decisions, identifies high-ROI opportunities, drives 20-40% better capital allocation'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Cash Flow Forecasting & Working Capital Analysis',
      category: 'top5',
      baselineHours: 3.5,
      aiEnabledHours: 0.40,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 8.75,
      annualHoursFreed: 155,
      payrollFreed: 155 * hourlyRate,
      scenario: 'Monday morning. Your CFO asks: "What\'s our cash position looking like for the next 90 days? Any concerns? I\'m meeting with our bank Thursday to discuss the credit line and need to know if we should increase it." You need to forecast AR collections, AP obligations, payroll, and any major cash events.',
      oldWay: 'Pull AR aging report from NetSuite → Manually estimate when customers will pay (historical avg is 45 days, but some pay sooner, some later) → Build collection forecast → Pull AP aging → Check when bills are due → Pull payroll schedule from HRIS → Calculate bi-weekly payroll totals → Check for any major expenses coming up (did we sign any new contracts?) → Search email for "contract signed" → Find 3 contracts → Add to forecast → Build 13-week cash flow model in Excel → Realize you forgot about the annual insurance payment in 6 weeks ($120K) → Add it → Calculate ending cash balance each week → Identify weeks where cash dips below $500K minimum → Build recommendations: Need to collect from slow-paying customers or delay some AP → Check credit line utilization → Prepare memo for CFO. Takes 3.5 hours.',
      aiVoiceWay: 'Monday at 9 AM, CFO makes request. While reviewing your morning emails, you say: "AIVA, create 13-week cash flow forecast. Include AR collections, AP obligations, payroll, major expenses, and flag any weeks below $500K minimum cash. Recommend if we need to increase credit line." In 25 minutes, AIVA responds: "13-week cash flow forecast: Starting cash $1.2M. Collections forecast: $2.4M over 13 weeks based on AR aging and historical payment patterns (TechCorp $450K week 3, GlobalCo $280K week 5, etc). Major collections at risk: Acme Corp $120K is 60 days past due—recommend collections outreach. Disbursements: $2.1M (AP $840K, payroll $980K, major expenses $280K including annual insurance $120K week 6). Ending cash by week: Weeks 1-5 above $800K (healthy), Week 6 dips to $480K (below minimum due to insurance payment + slow collections week), Weeks 7-13 recover to $600K-$900K. Recommendation: Increase credit line from $500K to $750K as safety buffer OR accelerate collections from Acme Corp + 2 other slow payers. Credit line utilization currently $180K. Detailed cash flow model and CFO memo ready." You review (20 minutes), validate major assumptions, send to CFO Tuesday morning. CFO: "Great analysis. Let\'s increase the credit line to $750K."',
      didYouKnow: {
        show: true,
        insight: 'Companies that forecast cash flow weekly instead of monthly avoid 80% of cash crisis situations. But weekly forecasting is only sustainable with AI—otherwise finance teams burn out on repetitive updates and miss early warning signs.'
      },
      valueAddedSuggestion: {
        hours: 3.1,
        activity: 'Treasury Management & Capital Efficiency Optimization',
        description: 'Optimize cash deployment, evaluate investment opportunities, manage banking relationships',
        expectedImpact: 'Improves cash efficiency 20-30%, reduces borrowing costs, maximizes interest income'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Executive Dashboard Creation & KPI Reporting',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 8.3,
      annualHoursFreed: 110,
      payrollFreed: 110 * hourlyRate,
      scenario: 'Every Monday your CEO wants the exec dashboard updated: revenue (actuals vs plan), cash balance, runway, burn rate, ARR, churn, new bookings, pipeline coverage, headcount, and top 5 metrics by department. They review this in the Monday morning exec meeting and you need it ready by 8 AM.',
      oldWay: 'Sunday evening (yes, working on Sunday): Open your exec dashboard template → Pull revenue data from NetSuite → Compare to budget → Calculate variance → Pull cash balance → Calculate burn rate (subtract last month\'s cash from this month) → Calculate runway (cash / monthly burn) → Pull ARR from subscription management system → Calculate churn rate → Pull new bookings from Salesforce → Calculate pipeline coverage (pipeline / quota) → Pull headcount from HRIS → Realize engineering hired 2 people last week but they\'re not in the system yet → Manually add them → Pull department-specific KPIs: Engineering (velocity, sprint completion), Sales (quota attainment, pipeline), Marketing (CAC, MQL), CS (NPS, retention) → Data is in 6 different places → Manually compile everything → Update charts → Check all formulas → Find 1 error in runway calculation → Fix it → Export to PDF → Email CEO at 9:47 PM Sunday. Monday morning: CEO responds "Thanks, but we already covered this in the meeting without you since it came late."',
      aiVoiceWay: 'Friday at 4 PM, you say: "AIVA, update the exec dashboard for Monday morning. Include all standard KPIs, highlight any major changes from last week, and flag anything that needs CEO attention." Over the weekend, AIVA automatically updates: "Exec dashboard updated (week ending Oct 27): Revenue $1.04M vs $980K plan (+6%, strong week). Cash balance $3.2M, burn rate $420K/month (down from $450K last month due to delayed hires), runway 7.6 months (healthy). ARR $12.8M (+$180K from 4 new deals), churn 1.2% (improved from 1.8% last month). New bookings $240K (vs $200K target). Pipeline coverage 2.1x (healthy). Headcount 87 (+2 in engineering, +1 in sales last week). Department highlights: Engineering shipped 2 major features, velocity up 8%. Sales closed 4 deals including $90K enterprise deal with GlobalCorp. Marketing CAC improved to $420 (from $480). CS NPS improved to 68 (from 64). Alerts: None—all metrics healthy. Dashboard PDF ready." CEO receives the email at 7 AM Monday (auto-sent), reviews before exec meeting. CEO response: "Excellent week team! Great numbers."',
      didYouKnow: {
        show: true,
        insight: 'Executives who start their week with accurate KPI dashboards make 2.5x faster decisions throughout the week. But finance analysts who spend Sunday evenings updating dashboards burn out within 18 months—AI delivers better dashboards without weekend work.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Predictive Analytics & Business Intelligence',
        description: 'Build predictive revenue models, identify trends before they\'re obvious, provide forward-looking insights',
        expectedImpact: 'Shifts finance from reporting the past to predicting the future, drives proactive decision-making'
      },
      additionalImpactQuestions: []
    }
  ],

  'Operations Manager - Manufacturing': (hourlyRate) => [
    {
      id: 1,
      title: 'Production Planning & Schedule Optimization',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.25,
      frequency: 'daily',
      occurrencesPerYear: 250,
      timeMultiplier: 10.0,
      annualHoursFreed: 562.5,
      payrollFreed: 562.5 * hourlyRate,
      scenario: 'You\'re reviewing tomorrow\'s production schedule when a rush order comes in',
      oldWay: 'You\'d spend 2-3 hours manually adjusting the schedule, checking capacity constraints across multiple systems, coordinating with procurement on material availability, and updating the team',
      aiVoiceWay: 'You describe the rush order to your AI voice partner while walking the floor. Within 30 seconds, it analyzes capacity constraints, material availability, and labor resources, then suggests three optimal scheduling scenarios with trade-off analysis',
      didYouKnow: {
        show: true,
        insight: 'By completing schedule adjustments in minutes instead of hours, you unblock your entire production team\'s morning work. Three departments and 45+ workers get clear direction 2 hours earlier each day'
      },
      valueAddedSuggestion: {
        hours: 2.25,
        activity: 'Strategic Capacity Planning',
        description: 'Use freed time to analyze 3-6 month capacity trends and develop scenario plans',
        expectedImpact: 'Prevents 2-3 crisis situations per quarter worth $50K-$150K each'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Did this faster scheduling prevent any downstream issues?',
          options: [
            { value: 'prevented_downtime', label: 'Prevented line downtime or delays', impact: 'high' },
            { value: 'avoided_overtime', label: 'Avoided unnecessary overtime costs', impact: 'medium' },
            { value: 'improved_delivery', label: 'Improved on-time delivery performance', impact: 'medium' },
            { value: 'none', label: 'No specific prevention this time', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Quality Investigation & Root Cause Analysis',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.33,
      frequency: 'per incident',
      occurrencesPerYear: 120,
      timeMultiplier: 9.0,
      annualHoursFreed: 320,
      payrollFreed: 320 * hourlyRate,
      scenario: 'A quality defect is discovered on the production line',
      oldWay: 'You\'d spend 3-4 hours pulling historical data, consulting quality engineers, analyzing similar past issues, and documenting findings',
      aiVoiceWay: 'You verbally describe the defect while standing at the line. Your AI voice partner asks clarifying questions, searches 10,000+ past defect records, and suggests probable root causes with immediate containment actions',
      didYouKnow: {
        show: true,
        insight: 'Quality investigations completed in 20 minutes vs 3 hours means containment happens before defective product progresses. This prevents $15K-$75K in scrap and rework per major incident'
      },
      valueAddedSuggestion: {
        hours: 2.67,
        activity: 'Predictive Quality Analytics',
        description: 'Analyze quality trend data and implement early warning systems',
        expectedImpact: 'Reduces defect rates 15-25% over 12 months'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Supplier Coordination & Issue Resolution',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.25,
      frequency: 'daily',
      occurrencesPerYear: 250,
      timeMultiplier: 6.0,
      annualHoursFreed: 312.5,
      payrollFreed: 312.5 * hourlyRate,
      scenario: 'A critical supplier reports a delivery delay',
      oldWay: 'Research contract terms, check alternatives, calculate impact, prepare for negotiation, then document everything',
      aiVoiceWay: 'Your AI voice partner instantly provides contract leverage, alternative suppliers with lead times, and production impact analysis. During calls, it suggests follow-ups and auto-documents',
      didYouKnow: { show: false, insight: '' },
      valueAddedSuggestion: {
        hours: 1.25,
        activity: 'Strategic Supplier Development',
        description: 'Proactive supplier relationship management and multi-sourcing strategy',
        expectedImpact: 'Reduces supply disruptions 40-60%, improves supplier performance'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Team Coaching & Performance Management',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per week',
      occurrencesPerYear: 50,
      timeMultiplier: 8.0,
      annualHoursFreed: 87.5,
      payrollFreed: 87.5 * hourlyRate,
      scenario: 'One of your production supervisors (Mike, manages 15 line workers) comes to you: "I have a performance issue with one of my workers. He\'s missing quality standards 40% of the time, other workers are complaining, but I don\'t know how to have the conversation without making it worse. What should I do?" You need to coach Mike on how to handle this delicate situation.',
      oldWay: 'Pull employee file to review past performance → Check quality metrics to verify the issue → Review company performance management policy → Try to remember your own training on difficult conversations → Google "how to coach employee with performance issues" → Read 4 articles → Draft talking points for Mike → Schedule 1-hour coaching session with Mike tomorrow → During session, roleplay the conversation → Mike is nervous and unsure → Provide feedback → Mike still not confident → Schedule follow-up after he has the conversation → Mike has conversation, it goes poorly → Employee gets defensive → Situation escalates → Now you need to get involved directly → Total time: 2 hours of your time + employee relations issue.',
      aiVoiceWay: 'Mike comes to you at 2 PM. While walking with him to a private area, you say: "AIVA, create a coaching plan for Mike to address a performance issue. Employee is missing quality standards 40% of the time. Mike needs specific guidance on how to have the conversation, what to say, and how to handle resistance." In 15 minutes, AIVA provides: "Performance coaching plan for Mike: Conversation structure: 1) Start with specific data (\'Quality standards met 60% of time last month vs team average of 92%\'), 2) Ask employee for their perspective (\'What\'s getting in the way of hitting standards?\'), 3) Listen for root causes (training gap? equipment issues? personal situation?), 4) Collaborate on improvement plan (\'What support do you need? Let\'s set a goal of 85% by end of month\'), 5) Document agreement and follow-up date. Suggested opening: \'I want to discuss your quality metrics. I\'ve noticed you\'re at 60% vs our 92% standard. Help me understand what\'s happening.\' How to handle common responses: If defensive (\'The standards are too high\'), respond: \'I understand it\'s challenging, but 15 other workers are hitting 90%+. Let\'s figure out what\'s different.\' If personal issues mentioned, offer EAP resources. Documentation template ready. Follow-up plan: Check-in in 2 weeks, measure progress monthly." You coach Mike in 20 minutes using this framework. Mike feels prepared. Has conversation next day. Employee responds well, reveals he wasn\'t trained on new quality procedure. Training provided. Problem solved. Quality improves to 89% within 3 weeks.',
      didYouKnow: {
        show: true,
        insight: 'Managers who address performance issues within 1 week using structured coaching see 3.2x better improvement rates than those who delay or use vague feedback. Early intervention prevents minor issues from becoming terminations—saving $15K-$40K in replacement costs per role.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Proactive Team Development & Succession Planning',
        description: 'Build training programs, cross-train team members, develop future supervisors',
        expectedImpact: 'Team productivity +15-25%, turnover -30-40%, builds leadership pipeline'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Equipment Maintenance Planning & Downtime Prevention',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.20,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 7.5,
      annualHoursFreed: 65,
      payrollFreed: 65 * hourlyRate,
      scenario: 'Your maintenance system shows Production Line 3\'s critical stamping press has vibration levels trending upward over the last 2 weeks. The maintenance supervisor says: "Should we shut it down for preventive maintenance now, or wait until scheduled maintenance in 4 weeks?" Unplanned downtime costs $15K/hour. Scheduled downtime costs $8K/hour. Wrong decision could cost $50K-$120K.',
      oldWay: 'Pull maintenance history for Line 3 press → Review last 18 months of vibration sensor data → Manually plot trends in Excel → Check past similar situations → Find 3 instances → In 2 cases, waiting caused catastrophic failure ($120K in emergency repairs + 2 days downtime = $360K total cost). In 1 case, preventive maintenance was unnecessary (wasted $8K). Not sure which pattern this matches → Call equipment manufacturer tech support → Wait on hold 25 minutes → Tech says "Hard to say without seeing the data, but we recommend preventive maintenance to be safe" (CYA answer) → Consult with maintenance team lead → They say "I think we can wait" but not confident → Calculate costs: Preventive now = $8K planned downtime. Wait and it fails = $120K repair + $240K unplanned downtime (2 days × 8 hours × $15K/hour) = $360K. But if it doesn\'t fail, we save $8K... → Decision paralysis. Finally decide to wait (trying to save money). 3 weeks later: Press fails catastrophically. Total cost: $380K. CEO is furious.',
      aiVoiceWay: 'You see the vibration alert Monday morning. While reviewing the production floor, you say: "AIVA, analyze Line 3 stamping press vibration trends. Assess failure risk, compare to historical patterns, and recommend: preventive maintenance now or wait until scheduled maintenance in 4 weeks. Include cost-benefit analysis." In 12 minutes, AIVA responds: "Line 3 stamping press analysis: Vibration levels increased 23% over last 14 days. Pattern match: 87% similar to historical Failure Pattern A (July 2023 and March 2022)—both resulted in catastrophic bearing failures within 3-4 weeks of alert. Failure Pattern A cost average: $340K (emergency repairs + unplanned downtime). Only 13% similar to benign vibration (December 2023—resolved on its own). Failure probability if you wait 4 weeks: 78%. Cost analysis: Preventive maintenance now: $8K (1 day planned downtime). Wait and failure occurs: Expected cost $280K (78% × $360K). Expected value: Preventive maintenance saves $272K on average. Recommendation: SHUT DOWN for preventive maintenance this weekend. Parts available, maintenance crew scheduled. Risk mitigation: Absorb Saturday production on Lines 1, 2, and 4 (capacity available). Should I schedule the maintenance?" You say "Yes." Preventive maintenance completed Saturday. Press repaired. Cost: $8,200. Prevented failure: $280K+ saved. CEO response: "Great proactive call."',
      didYouKnow: {
        show: true,
        insight: 'Predictive maintenance prevents 60-80% of catastrophic equipment failures. But interpreting sensor data and historical patterns takes expertise most operations managers don\'t have time to develop—AI provides instant expert-level predictive analysis.'
      },
      valueAddedSuggestion: {
        hours: 1.3,
        activity: 'Strategic Asset Management & Capital Planning',
        description: 'Evaluate equipment ROI, plan capital investments, optimize maintenance strategies',
        expectedImpact: 'Improves OEE by 5-10 points, reduces emergency maintenance 50-70%, optimizes capex decisions'
      },
      additionalImpactQuestions: []
    }
  ],

  'Project Manager': (hourlyRate) => [
    {
      id: 1,
      title: 'Cross-Project Status Report Generation',
      category: 'top5',
      baselineHours: 3.5,
      aiEnabledHours: 0.40,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 8.75,
      annualHoursFreed: 155,
      payrollFreed: 155 * hourlyRate,
      scenario: 'It\'s Friday at 11 AM. You manage 7 active projects with 23 team members across engineering, design, and product. Your VP Slacks: "Need status on all projects for the exec meeting at 2 PM. What\'s at risk? What\'s on track? Any blockers?" You haven\'t updated JIRA in 3 days because you\'ve been in back-to-back meetings.',
      oldWay: 'Open JIRA → Filter by your 7 projects → Check sprint progress for each project → Open 7 different Slack channels to read updates → Check Google Calendar to see who was out this week → Manually compile status: Project A (on track), Project B (1 week behind due to API issues), Project C (blocked waiting for design)... → Open shared drives to check design progress → Slack 5 people: "Hey, what\'s your status on X?" → Wait for responses → Only 3 respond → Update status doc → Realize you forgot Project G → Go back and check → Write executive summary highlighting risks → Format everything. Done at 1:52 PM (8 minutes before the meeting, stress level: maximum).',
      aiVoiceWay: 'You see the VP\'s Slack at 11:02 AM. While walking to grab lunch, you say: "AIVA, generate status report for all my projects. Include progress vs plan, risks, blockers, and team capacity." In 25 minutes (by the time you finish lunch), AIVA responds: "7 active projects analyzed. 4 on track: Projects A, D, F, G. 2 at risk: Project B is 1 week behind due to API integration complexity—engineering estimates 3 more days. Project C blocked for 4 days waiting on final design mockups from Sarah. 1 ahead of schedule: Project E launched early, now in monitoring phase. Team capacity: 3 engineers out next week for conference—may impact Project B timeline. Recommendations: 1) Escalate design blocker for Project C, 2) Consider adding 1 engineer to Project B to recover timeline. Detailed status report ready." You review (10 minutes), add context, and send to VP at 11:37 AM. VP response: "Perfect, let\'s discuss Project B and C in the meeting."',
      didYouKnow: {
        show: true,
        insight: 'Project managers spend an average of 18 hours per week on status reporting and meetings instead of solving problems. By automating status collection in 15 minutes instead of 3+ hours, you preserve your most valuable asset: time to unblock your team.'
      },
      valueAddedSuggestion: {
        hours: 3.1,
        activity: 'Proactive Risk Management & Team Unblocking',
        description: 'Identify risks before they become critical, remove blockers, coach team members',
        expectedImpact: 'Reduces project delays by 40-60%, improves team velocity and morale'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Did faster status reporting prevent project delays or help unblock your team?',
          options: [
            { value: 'prevented_delay', label: 'Yes, caught issues early and prevented 1-2 week delay ($25K-$75K value)', impact: 'high' },
            { value: 'unblocked_team', label: 'Yes, identified and resolved blockers faster', impact: 'high' },
            { value: 'better_decisions', label: 'Yes, leadership made faster decisions on resources', impact: 'medium' },
            { value: 'none', label: 'Just provided status update', impact: 'none' }
          ]
        },
        {
          id: 'q2',
          question: 'Did this reporting approach benefit others in your organization?',
          options: [
            { value: 'became_standard', label: 'Yes, other PMs now use this status report format', impact: 'high' },
            { value: 'improved_visibility', label: 'Yes, executives now have better project visibility', impact: 'medium' },
            { value: 'reduced_meetings', label: 'Yes, reduced unnecessary status meetings by 50%', impact: 'medium' },
            { value: 'none', label: 'Just for my projects', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Risk Assessment & Mitigation Planning',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per project phase',
      occurrencesPerYear: 60,
      timeMultiplier: 8.3,
      annualHoursFreed: 132,
      payrollFreed: 132 * hourlyRate,
      scenario: 'You\'re kicking off a new project: rebuild the checkout flow for your e-commerce platform. Budget: $240K, timeline: 16 weeks, team: 5 engineers, 1 designer, 1 product manager. Your sponsor asks: "What could go wrong? I need a risk assessment before I approve the budget."',
      oldWay: 'Schedule risk assessment workshop with team (takes 3 days to find a time everyone is available) → Facilitate 2-hour brainstorming session to identify risks → Manually document risks in spreadsheet → Research similar past projects to see what went wrong → Spend hours reading post-mortems → Interview 4 engineers who worked on similar projects → Categorize risks by likelihood and impact → Brainstorm mitigation strategies for each risk → Calculate contingency budget needed → Write risk assessment document → Review with team → Revise document. Total: 2.5 hours of meetings + documentation spread over 5 days.',
      aiVoiceWay: 'Kickoff meeting ends at 3 PM Tuesday. While walking back to your desk, you say: "AIVA, create a risk assessment for rebuilding the checkout flow. Budget is $240K, timeline is 16 weeks, team is 5 engineers, 1 designer, 1 product manager. Include technical risks, timeline risks, resource risks, and mitigation strategies." In 20 minutes, AIVA provides: "Risk assessment for checkout rebuild project: High risks: 1) Payment gateway integration complexity—past projects averaged 3 weeks vs 2 week estimate, mitigation: add 1 week buffer and start integration in week 2 instead of week 10. 2) Third-party API dependencies (Stripe, tax calculation)—potential for breaking changes, mitigation: build abstraction layer. Medium risks: 3) Holiday season code freeze conflicts with go-live date, mitigation: move launch to early November. 4) Only 1 designer for 5 engineers—bottleneck risk, mitigation: front-load design work or add contractor. Low risks: 5) Team member PTO during project. Contingency recommendation: Add $35K (15%) buffer. Similar projects: Analyzed 8 past checkout projects—average 12% over budget, 3 weeks over timeline. Detailed risk register and mitigation plan ready." You review, customize, present to sponsor same day. Project: approved.',
      didYouKnow: {
        show: true,
        insight: 'Projects with comprehensive risk assessments completed before kickoff are 3x more likely to deliver on time and budget. But most PMs skip detailed risk planning because it takes too long—AI makes it instant.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic Project Portfolio Optimization',
        description: 'Evaluate project priorities, recommend resource reallocation, improve project selection',
        expectedImpact: 'Delivers 30-50% more business value with same resources'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Resource Allocation & Conflict Resolution',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per conflict',
      occurrencesPerYear: 40,
      timeMultiplier: 8.0,
      annualHoursFreed: 70,
      payrollFreed: 70 * hourlyRate,
      scenario: 'Two projects need the same senior engineer (David) at the same time. Project A manager says: "David is critical for our database migration next week—we promised the customer a go-live date." Project B manager says: "David is the only one who understands our legacy API—if he doesn\'t fix this security issue, we have to delay our SOC 2 audit." You\'re stuck in the middle.',
      oldWay: 'Check both project timelines → Try to understand which is truly more urgent → Ask David how much time each task will take → David says "I don\'t know, maybe 2-3 days each?" → Check if there are other engineers who could help → Call 3 other engineers → All say they\'re slammed → Try to negotiate with Project A manager to delay 1 week → They say "Customer will cancel the contract if we miss the deadline" → Try to find contractor to help → Realize you can\'t get contractor onboarded fast enough → Escalate to VP of Engineering → Schedule meeting for tomorrow → Waste 2 hours of everyone\'s time in a tense meeting → Finally decide David splits time 60/40 between projects → Neither project is happy → Both projects end up delayed anyway.',
      aiVoiceWay: 'Both managers Slack you at the same time (9:47 AM). While grabbing coffee, you say: "AIVA, analyze resource conflict for David between Project A database migration and Project B security fix. Check project timelines, assess criticality, identify alternatives, and recommend solution." In 15 minutes, AIVA responds: "David conflict analysis: Project A migration is 8 days of work, critical path, delays go-live from May 15 to May 23 (1 week slip costs $40K in delayed revenue). Project B security fix is 3 days of work, blocks SOC 2 audit scheduled May 20 (delay costs $15K audit rescheduling + 6-week wait). Alternative: Engineer Sarah has 60% overlap with David\'s database skills—could handle Project A with 1 day of knowledge transfer from David. Recommendation: David focuses on Project B security fix (3 days), then supports Sarah on Project A (1 day transfer + 2 days support as needed). Project A delayed by 2 days, but both projects complete on time. Risk: minimal. Would you like me to send proposed plan to all stakeholders?" You say "Yes." Decision made, email sent, conflict resolved in 20 minutes instead of 2 hours + meeting.',
      didYouKnow: {
        show: true,
        insight: 'Resource conflicts cost companies an average of $12K per incident in delayed projects and team frustration. By resolving conflicts 90 minutes faster with data-driven recommendations, you prevent delays from cascading and preserve team morale.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Strategic Capacity Planning & Skills Development',
        description: 'Build resource forecasting models, identify skill gaps, develop cross-training programs',
        expectedImpact: 'Reduces resource conflicts by 60%, improves team flexibility and resilience'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Stakeholder Communication & Expectation Management',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per project weekly',
      occurrencesPerYear: 150,
      timeMultiplier: 8.0,
      annualHoursFreed: 262.5,
      payrollFreed: 262.5 * hourlyRate,
      scenario: 'You\'re managing a website redesign project. You have 8 stakeholders: CEO (wants modern design), CMO (wants lead generation optimization), VP Sales (wants better demo tools), Product (wants feature showcase), Customer Success (wants help center), Engineering (wants technical feasibility), Design (wants creative freedom), and Legal (wants compliance). Each stakeholder emails you 3-5 times per week with questions, requests, and concerns. You\'re drowning in stakeholder management.',
      oldWay: 'Check email: 24 new messages about the project since yesterday → CEO wants to see latest mockups → CMO wants conversion rate projections → VP Sales wants demo environment ready 2 weeks earlier → Product wants to add 3 new features → CS wants to completely redesign help center → Engineering says original timeline is impossible → Design is frustrated with too much feedback → Legal has 47 compliance questions → Try to respond to everyone → Spend 30 minutes drafting email to CEO → Get interrupted → Spend 20 minutes on CMO response → Schedule meeting with VP Sales to discuss timeline → Meeting takes 45 minutes → Document decisions → Update project plan → Email everyone with updates → More questions come in → Repeat daily. Stakeholder communication takes 2+ hours per day, leaving no time for actual project work.',
      aiVoiceWay: 'Monday morning, while commuting, you say: "AIVA, handle stakeholder communications for the website redesign project today. Summarize overnight emails, draft responses for my review, flag anything that needs my personal attention, and update stakeholders on Friday\'s progress." By the time you arrive at the office, AIVA provides: "24 stakeholder emails processed: CEO question on mockups—draft response sent with latest designs + explanation of design rationale. CMO conversion rate question—drafted response with projected 35% improvement based on A/B test plans. VP Sales early timeline request—flagged for your attention (requires trade-off decision: Cut features OR delay launch OR add resources). Product feature requests—analyzed 3 requests, 1 aligns with roadmap (added to backlog), 2 would delay launch by 3 weeks (draft response explaining trade-offs ready). CS help center redesign—created mini project plan, estimated 2 weeks parallel work. Engineering timeline concern—scheduled 30-minute alignment meeting for Tuesday. Design feedback overload—consolidated 15 pieces of conflicting feedback into 4 key themes, shared with design lead. Legal compliance—answered 38 of 47 questions using templates, flagged 9 for legal review. All draft responses ready for your review. Action items: 1) Decision needed on VP Sales timeline request, 2) Legal review needed for 9 questions. Everything else handled." You review drafts (20 minutes), make minor adjustments, approve. Stakeholders receive clear, timely responses. Your time spent: 25 minutes instead of 2 hours.',
      didYouKnow: {
        show: true,
        insight: 'Project managers spend 60-70% of their time on stakeholder communication instead of actual project execution. By automating routine communications and surfacing only decision-points, you free up 75% of stakeholder management time for actual problem-solving.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Strategic Project Leadership & Change Management',
        description: 'Focus on change adoption, remove organizational blockers, drive transformation initiatives',
        expectedImpact: 'Increases project success rate 40-60%, builds change management capability'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Retrospective Facilitation & Process Improvement',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.30,
      frequency: 'per project end',
      occurrencesPerYear: 15,
      timeMultiplier: 6.7,
      annualHoursFreed: 25.5,
      payrollFreed: 25.5 * hourlyRate,
      scenario: 'Project just finished (3 months, $240K budget, 8-person team). Your VP says: "What did we learn? We need a retrospective to capture lessons before the team moves to their next projects. I want actionable improvements, not just complaints." You have 1 week to facilitate the retro and document findings.',
      oldWay: 'Schedule retrospective meeting (takes 3 days to find a time when all 8 people are available) → Send pre-retro survey to gather feedback → Only 4 people respond → Facilitate 2-hour retrospective meeting → Ask "What went well? What didn\'t? What should we improve?" → Everyone shares their perspective → Lots of venting, some finger-pointing → Try to identify themes → Capture 37 different improvement ideas on whiteboard → Some contradict each other → Try to prioritize → Team can\'t agree → Finally identify top 5 improvements through voting → Document everything → Write retrospective report → Realize you didn\'t capture action items → Schedule follow-up meeting → Finally document lessons learned. Total time: 5+ hours including meetings. 3 months later: Nobody remembers the lessons and you make the same mistakes on next project.',
      aiVoiceWay: 'Project ends Friday. You say: "AIVA, prepare retrospective for website redesign project. Analyze project data: timeline, budget, team feedback, issues encountered. Identify top lessons learned and recommend process improvements." Over the weekend, AIVA analyzes: "Project retrospective for website redesign: Timeline: Planned 12 weeks, actual 14 weeks (2 weeks over). Budget: Planned $240K, actual $267K ($27K over, 11% variance). Root cause of delay: Design revisions (4 rounds vs planned 2 rounds) added 10 days. Scope creep (3 unplanned features added mid-project) added 8 days. Key lessons: 1) Design approval process needs clearer sign-off criteria (prevented endless revisions). 2) Scope change process needs formal approval (prevent mid-project additions). 3) Engineering estimates should include 20% buffer for integration complexity. 4) Stakeholder alignment upfront prevents late-stage changes (CEO involvement earlier). 5) Designer-to-developer ratio was wrong (1 designer for 5 developers created bottleneck). Recommended process improvements: Implement design approval checklist, create scope change request form requiring exec approval, adjust estimation methodology, add executive design review in week 1. Team sentiment: 7.2/10 overall, frustrated with scope changes but proud of final result. Retrospective doc with action items ready." You facilitate 60-minute meeting using this data. Team agrees on 5 concrete improvements. Meeting: productive. Next project: applies lessons, finishes on time and on budget.',
      didYouKnow: {
        show: true,
        insight: 'Teams that conduct data-driven retrospectives and implement improvements reduce project delays by 45% on subsequent projects. But most retrospectives become complaint sessions without actionable outcomes—AI turns feedback into structured improvement plans.'
      },
      valueAddedSuggestion: {
        hours: 1.7,
        activity: 'Project Management Methodology Development',
        description: 'Build PM frameworks, create templates and playbooks, establish project standards',
        expectedImpact: 'Standardizes excellence across all projects, accelerates new PM ramp time, improves predictability'
      },
      additionalImpactQuestions: []
    }
  ],

  'Account Executive': (hourlyRate) => [
    {
      id: 1,
      title: 'Deal Strategy & Competitive Positioning',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per major deal',
      occurrencesPerYear: 40,
      timeMultiplier: 8.3,
      annualHoursFreed: 88,
      payrollFreed: 88 * hourlyRate,
      scenario: 'You\'re working a $450K enterprise deal with GlobalCorp. Champion says: "We\'re also evaluating Competitor X and Competitor Y. Your solution is more expensive. Can you send me a comparison document by tomorrow\'s exec meeting?" It\'s 4:37 PM and you have dinner plans.',
      oldWay: 'Search Slack for "Competitor X comparison" → Find outdated battle card from 8 months ago → Check shared Google Drive → Find 6 different versions, not sure which is current → Read through Competitor X website to see what\'s new → Check G2 reviews to see what customers say → Search your email for past deals against Competitor X → Find 3 old proposals and try to piece together differentiation → Realize you don\'t know anything about Competitor Y → Google "Competitor Y vs our product" → Read 4 articles → Try to build comparison table from memory → Not confident in accuracy → Slack sales engineer "Do you know how we compare to Competitor X on feature Z?" → Wait 40 minutes for response → Finally cobble together a document → Send at 7:52 PM, dinner plans: cancelled.',
      aiVoiceWay: 'Champion sends request at 4:37 PM. While packing your laptop, you say: "AIVA, create a competitive comparison for GlobalCorp deal. Compare us vs Competitor X and Competitor Y. Include pricing, features, customer fit, and why we\'re the best choice for their use case." In 18 minutes, AIVA provides: "Competitive comparison for GlobalCorp ($450K enterprise deal, financial services, 2,400 users): Pricing: You $450K annually, Competitor X $380K, Competitor Y $420K. Key differentiators: 1) Enterprise security—you have SOC 2 Type 2 + FedRAMP (GlobalCorp requires this for their banking customers, Competitor X doesn\'t have FedRAMP). 2) Salesforce native integration—GlobalCorp uses Salesforce, you\'re native, competitors use middleware (slower, less reliable). 3) 24/7 support—you include it, competitors charge $40K extra. Positioning: While competitors appear cheaper, total cost of ownership favors you by $65K when including FedRAMP compliance value and support. Win rate vs Competitor X: 67% (analyzed 23 head-to-head deals). Suggested talk track and customized comparison doc ready." You review (10 minutes), send to champion at 5:05 PM. Dinner plans: saved. Next day, champion says: "This was exactly what we needed—your security advantages are compelling." Deal: advancing.',
      didYouKnow: {
        show: true,
        insight: 'Deals with competitive positioning documents delivered within 24 hours close 2.1x faster than those without. But most AEs spend 60-90 minutes per competitive comparison—AI reduces this to 10 minutes, allowing you to be more responsive and win more deals.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic Relationship Building & Executive Selling',
        description: 'Develop C-suite relationships, understand business strategy, position as trusted advisor',
        expectedImpact: 'Increases deal size 40-70%, accelerates sales cycles, improves close rate'
      },
      additionalImpactQuestions: [
        {
          id: 'q1',
          question: 'Did this competitive positioning help advance or win the deal?',
          options: [
            { value: 'won_deal', label: 'Yes, helped win the deal ($100K-$500K revenue)', impact: 'high' },
            { value: 'advanced_deal', label: 'Yes, moved deal to next stage faster', impact: 'high' },
            { value: 'prevented_loss', label: 'Yes, prevented loss to competitor', impact: 'high' },
            { value: 'none', label: 'Still in progress', impact: 'none' }
          ]
        },
        {
          id: 'q2',
          question: 'Did this benefit your sales team beyond just this deal?',
          options: [
            { value: 'became_standard', label: 'Yes, became our standard battle card template', impact: 'high' },
            { value: 'helped_team', label: 'Yes, other AEs now use this competitive approach', impact: 'medium' },
            { value: 'updated_enablement', label: 'Yes, updated sales enablement materials', impact: 'medium' },
            { value: 'none', label: 'Just for this one deal', impact: 'none' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Custom Proposal & Pricing Optimization',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.35,
      frequency: 'per proposal',
      occurrencesPerYear: 50,
      timeMultiplier: 8.6,
      annualHoursFreed: 132.5,
      payrollFreed: 132.5 * hourlyRate,
      scenario: 'Your champion at TechStartup says: "Our CFO approved budget, but it\'s $320K and your quote was $390K. Can you sharpen your pencil? We need a revised proposal by Friday EOD (2 days) with creative payment terms because we\'re cash-flow sensitive right now." You need to figure out pricing, payment terms, and what concessions you can make.',
      oldWay: 'Open your pricing spreadsheet → Calculate different scenarios: What if we remove feature X? What if they pay annually vs quarterly? → Realize you need approval for discount over 15% → Email your sales manager "Can I discount to $320K?" → Wait 3 hours for response → Manager says "What\'s the justification? Show me the business case" → Write business case email explaining deal strategy → Get approval for $340K max → Now figure out payment terms: Can they do 50% upfront, 50% in 6 months? → Check with Finance on payment options → Finance says "We prefer quarterly" but customer wants annual → Negotiate middle ground → Build revised proposal document (12 pages) → Customize with their logo and use case → Add pricing table with multiple scenarios → Check all calculations 3 times → Send to sales engineer to verify technical specs → SE finds error → Fix error → Finally send proposal Friday at 4:47 PM.',
      aiVoiceWay: 'Champion sends request Wednesday at 2 PM. While finishing another call, you say: "AIVA, create revised proposal for TechStartup at $320K budget. They\'re cash-flow sensitive—suggest creative payment terms. Include what concessions we\'d need to make, approval requirements, and risk assessment." In 25 minutes, AIVA provides: "Revised proposal for TechStartup: Option 1: $320K with 12-month payment plan (quarterly payments). Remove advanced analytics module (customer said they won\'t use it for 12 months anyway). Requires VP approval for 18% discount. Option 2: $340K with deferred payment—50% upfront, 50% at day 180. Includes full feature set. Requires manager approval for 13% discount. Option 3: $330K annual prepayment. Remove premium support, offer standard support. Manager approval only. Recommendation: Option 2—preserves deal value, addresses cash-flow concern, lowest discount. Past similar deals: Analyzed 8 cash-flow sensitive customers—6 chose deferred payment option. Risk: Low—TechStartup has $12M Series B funding. Proposal document ready with all 3 options, business case for VP approval drafted." You review (20 minutes), get approval from manager same day, send proposal to customer Thursday morning. Customer accepts Option 2 on Friday. Deal: closed.',
      didYouKnow: {
        show: true,
        insight: 'Complex pricing negotiations that take 3+ days give competitors time to swoop in with aggressive offers. By responding within 24 hours with multiple creative options, you demonstrate responsiveness and prevent buyer\'s remorse or competitive interference.'
      },
      valueAddedSuggestion: {
        hours: 2.65,
        activity: 'Pipeline Development & Strategic Prospecting',
        description: 'Build relationships with target accounts, develop multi-threading strategies, create pipeline',
        expectedImpact: 'Increases pipeline by 50-80%, improves predictability, exceeds quota consistently'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'C-Suite Meeting Preparation & Stakeholder Mapping',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per C-suite meeting',
      occurrencesPerYear: 30,
      timeMultiplier: 8.3,
      annualHoursFreed: 66,
      payrollFreed: 66 * hourlyRate,
      scenario: 'You finally got the meeting you\'ve been chasing for 3 months: CFO and CTO of MegaCorp (potential $800K deal) next Tuesday at 10 AM. Your champion says: "You\'ll have 30 minutes. CFO cares about ROI and payback period. CTO cares about security and integration complexity. They\'re evaluating 2 other vendors. Make it count." You need to be perfectly prepared.',
      oldWay: 'Research MegaCorp: Read their website, recent news, earnings reports, LinkedIn executive profiles → Takes 90 minutes → Build stakeholder map: Who reports to whom? Who has influence? → Stalk everyone on LinkedIn → Try to understand their business priorities → Google "MegaCorp digital transformation strategy" → Find vague press release → Research CFO and CTO background → CFO has finance background, CTO came from Amazon → Build custom pitch deck → Calculate ROI for their specific situation (need to estimate their costs, efficiency gains) → Make assumptions, not sure if accurate → Prepare for objections → Practice pitch → Realize you don\'t have a good answer for their integration question → Panic-Slack your SE at 10 PM → SE responds next morning with technical details → Revise deck → Final prep done Monday night, confidence level: 60%.',
      aiVoiceWay: 'Meeting scheduled Friday for Tuesday. Friday afternoon, you say: "AIVA, prep me for C-suite meeting with MegaCorp CFO and CTO on Tuesday. Research the company, executives, business priorities, and create customized pitch. Include ROI calculation, integration approach, and competitive positioning." Over the weekend, AIVA prepares: "MegaCorp research: $2.3B revenue financial services company, 8,400 employees, digital transformation priority (CEO mentioned 4 times in last earnings call). CFO Maria Chen: ex-Goldman Sachs, cost-conscious, approved $50M tech budget this year. CTO David Park: ex-Amazon, focused on API-first architecture. Business priorities: 1) Reduce operational costs 15%, 2) Improve customer NPS from 42 to 60, 3) Cloud migration by Q3. ROI analysis for MegaCorp: Your solution will save $1.8M annually (340 hours/week of manual work eliminated, $220/hour blended cost). Payback period: 5.3 months. Integration: MegaCorp uses Salesforce and AWS—you have native integration for both (key differentiator vs competitors). Recommended pitch structure, objection handling, and custom deck ready." You review Monday morning (30 minutes), practice, make small adjustments. Tuesday meeting: You nail it. CFO says "Your ROI analysis is the most thorough we\'ve seen." CTO says "I love that you\'re native on AWS." Next step: technical deep-dive scheduled. Deal: advancing fast.',
      didYouKnow: {
        show: true,
        insight: 'AEs who spend 10+ hours preparing for C-suite meetings close 3.8x more enterprise deals than those who "wing it." But most AEs don\'t have 10 hours to prepare—AI compresses deep preparation into 30 minutes, giving you the edge without the burnout.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic Account Planning & Expansion',
        description: 'Develop account penetration strategies, identify expansion opportunities, build executive relationships',
        expectedImpact: 'Increases account revenue 60-120% through expansions and upsells'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Pipeline Forecasting & Commit Call Preparation',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 8.3,
      annualHoursFreed: 110,
      payrollFreed: 110 * hourlyRate,
      scenario: 'Every Friday at 3 PM you have a commit call with your VP of Sales. You need to forecast what will close this month and commit to a number. Miss your commit and you lose credibility. Over-commit and you create a revenue gap. You manage 23 active opportunities worth $2.4M and need to predict which 6-8 deals will actually close by month-end (9 days away).',
      oldWay: 'Open Salesforce → Review all 23 opportunities → Check each deal stage → Read notes from last interactions → Try to remember conversations → Which deals feel real? → Call top 5 prospects to "check in" (really trying to gauge close probability) → 3 don\'t answer → Check email history for buying signals → Review demo attendance, proposal opens, exec engagement → Manually calculate weighted forecast: This $200K deal feels 70% likely, that $150K deal maybe 40%, this $90K deal is 90%... → Build forecast spreadsheet → Realize you\'re forgetting important context → Review Slack messages with sales engineer about deal progress → Adjust probabilities → Calculate total: $847K weighted forecast → Not confident in this number → Call mentor: "Does this feel right?" → Revise to $780K → Still not sure → Join commit call nervous. Commit to $780K. Actual month-end close: $620K. VP is disappointed. Your credibility: damaged.',
      aiVoiceWay: 'Friday at 1 PM (2 hours before commit call), while finishing lunch, you say: "AIVA, forecast which of my 23 active deals will close by month-end. Analyze engagement signals, deal velocity, historical close patterns, and recommend my commit number." In 20 minutes, AIVA provides: "Pipeline forecast analysis (23 opportunities, $2.4M total): High confidence (80%+ close probability): 5 deals totaling $670K—TechCorp $200K (contract in legal review, verbal confirmation from CFO), GlobalCo $180K (demo completed, proposal approved, just waiting on PO), StartupInc $120K (signed MSA, implementing now), FinanceGroup $90K (exec sponsor confirmed, procurement approved), DataCo $80K (champion pushing hard, board approved budget). Medium confidence (40-60%): 6 deals totaling $580K. Low confidence (<30%): 12 deals totaling $1.15M (early stage, no exec engagement, or stalled). Weighted forecast: $895K. Conservative commit recommendation: $670K (high-confidence deals only, 90% probability of hitting this number). Aggressive commit: $820K (includes 2 medium-confidence deals likely to close). Deal-specific risk factors: TechCorp legal review could slip to next month (20% risk). GlobalCo waiting on PO (low risk, POs typically come through). Recommended commit: $670K (safe) or $750K (stretch). Historical analysis: Your deals at this stage close 78% of the time." You review, feel confident, commit to $720K on call. Month-end actual: $735K. VP: "Great forecast accuracy!"',
      didYouKnow: {
        show: true,
        insight: 'Sales reps who forecast within 10% accuracy build trust with leadership and get promoted 2.3x faster than those with erratic forecasts. But accurate forecasting requires analyzing dozens of signals per deal—AI does this instantly while you focus on closing.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic Deal Coaching & Win Strategy Development',
        description: 'Analyze lost deals to improve win rate, develop playbooks for different deal types, mentor junior AEs',
        expectedImpact: 'Increases win rate 15-25%, shortens sales cycles, builds team capability'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Contract Negotiation & Redline Review',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per enterprise deal',
      occurrencesPerYear: 25,
      timeMultiplier: 8.0,
      annualHoursFreed: 43.75,
      payrollFreed: 43.75 * hourlyRate,
      scenario: 'Your $500K enterprise deal with MegaCorp is almost done. Their legal team sends a 47-page redlined contract with 89 changes to your standard MSA. Your legal team is backlogged and says "We can review this in 5-7 business days." But MegaCorp needs an answer by Wednesday (3 days) or the deal pushes to next quarter (you miss your quota). You need to understand: Which redlines are acceptable? Which are deal-breakers? What should you push back on?',
      oldWay: 'Open the 47-page redlined contract → Start reading → Page 5: They want to change liability cap from unlimited to 2x annual fees → Is this okay? → Search email for "liability cap policy" → Can\'t find clear guidance → Read 12 pages of redlines → Indemnification clause changed → Not sure if this is standard → Highlight 23 changes you\'re unsure about → Email legal team: "Can you review these 23 items urgently?" → Legal responds: "We\'re slammed, this will take 3 days minimum" → Try to research contract terms yourself → Google "SaaS contract indemnification clause" → Read 8 articles → Still not confident → Ask sales ops → They don\'t know → Finally escalate to VP Sales → Schedule emergency meeting → VP, legal, and you meet for 90 minutes → Identify 8 unacceptable terms → Draft response to customer → Send Wednesday morning (barely made it). Customer responds: "We can accept 6 of your changes but liability cap is non-negotiable." → Back to legal → Another meeting → Finally resolve Thursday. Deal slips to next quarter anyway. Quota: missed.',
      aiVoiceWay: 'MegaCorp sends redlined contract Monday at 11 AM. While grabbing lunch, you say: "AIVA, analyze the MegaCorp contract redlines. Compare to our standard MSA, flag any unacceptable terms, identify negotiable items, and recommend our response strategy. Need answer by Wednesday." In 30 minutes, AIVA provides: "Contract redline analysis (89 changes): Unacceptable terms (must push back): 1) Liability cap changed to 1x annual fees (our standard: 2x)—too restrictive for enterprise deals. 2) Indemnification expanded to include indirect damages—opens unlimited liability exposure. 3) Auto-renewal removed—reduces contract duration from 3 years to 1 year (major revenue impact). Total: 3 deal-breaker terms. Negotiable items (can accept with minor adjustments): 14 items including payment terms (60 days vs 30 days), service level commitments, data retention period, audit rights. Acceptable changes (standard market terms): 72 items including definitions, notice periods, insurance requirements, dispute resolution. Recommended response: Accept 72 standard changes, negotiate 14 items (pre-drafted counter-language ready), push back hard on 3 deal-breakers. Talking points: Liability cap at 1x is below market for enterprise SaaS (show comparable contracts at 2-3x), indemnification change is non-standard (legal team will not approve), auto-renewal is standard in industry (show 4 peer contracts). Likelihood of acceptance: 85% based on 34 similar enterprise negotiations. Draft response ready for legal review." You review, get legal approval in 2 hours (they love that 90% of review is already done), send to customer Monday evening. Customer responds Tuesday: "We can accept liability cap at 2x and keep auto-renewal. Indemnification we need to discuss." Quick call Tuesday afternoon, resolved. Contract signed Wednesday. Deal closes this quarter. Quota: hit.',
      didYouKnow: {
        show: true,
        insight: 'Enterprise deals delayed by contract negotiations slip to next quarter 67% of the time, directly impacting quota attainment. AEs who can respond to legal redlines in 24 hours instead of 5-7 days close deals 3 weeks faster on average—that is the difference between hitting and missing quota.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Legal & Procurement Strategy Mastery',
        description: 'Learn contract negotiation tactics, build relationships with customer procurement, master enterprise sales cycles',
        expectedImpact: 'Increases enterprise deal close rate 30-50%, shortens legal review cycles, builds executive presence'
      },
      additionalImpactQuestions: []
    }
  ],

  'Product Manager': (hourlyRate) => [
    {
      id: 1,
      title: 'Feature Prioritization with Customer Feedback Analysis',
      category: 'top5',
      baselineHours: 4.0,
      aiEnabledHours: 0.50,
      frequency: 'per sprint planning',
      occurrencesPerYear: 26,
      timeMultiplier: 8.0,
      annualHoursFreed: 91,
      payrollFreed: 91 * hourlyRate,
      scenario: 'Sprint planning is tomorrow. You have 47 feature requests from customers, 23 ideas from sales, 18 technical debt items from engineering, and 8 strategic initiatives from your CEO. You need to prioritize what your team builds next sprint, and everyone thinks their idea is most important.',
      oldWay: 'Open spreadsheet with all requests → Read through 96 items → Try to remember context for each one → Check Salesforce to see which feature requests are tied to deals → Open Zendesk to count how many support tickets mention each feature → Read through 200+ customer feedback messages in Slack, email, and support tickets → Try to quantify impact of each feature → Assign RICE scores (Reach, Impact, Confidence, Effort) → Realize you don\'t have effort estimates → Slack engineering "How long would feature X take?" → Wait for responses → Only half respond → Make guesses for the rest → Sort by RICE score → Realize the top 5 features are all technically complex → Re-sort by quick wins → Engineering says "But we really need to tackle tech debt or the system will break" → Revise priorities again → Build prioritization doc to present at sprint planning → Takes 4 hours, still not confident it\'s right.',
      aiVoiceWay: 'Day before sprint planning, while eating lunch, you say: "AIVA, analyze all feature requests and prioritize for next sprint. Consider customer demand, revenue impact, strategic alignment, technical feasibility, and engineering capacity." In 35 minutes, AIVA provides: "Analyzed 96 items (47 customer requests, 23 sales ideas, 18 tech debt, 8 strategic). Top 5 priorities: 1) Advanced filtering for dashboard (requested by 18 enterprise customers representing $2.1M ARR, 7 tied to expansion deals, 3-day engineering effort, high impact). 2) API rate limit improvements (tech debt causing 40 support tickets/month, blocking 2 integrations, prevents system outages, 5-day effort). 3) Bulk export feature (requested by 12 customers, in 4 competitor tools, sales says it\'s blocking 3 deals worth $400K, 4-day effort). 4) Mobile app offline mode (strategic CEO priority, 8-week effort, recommend breaking into phases). 5) SSO integration (security requirement for 6 enterprise deals, 6-day effort). Recommended sprint scope: Items 1, 2, 3, 5 (18 days total, fits 2-week sprint with 2 engineers). Engineering confirmed estimates. Customer impact: affects 30+ customers, unlocks $400K+ in new revenue. Prioritization doc with rationale ready." You review (20 minutes), present at sprint planning, team aligned in 15 minutes instead of 90 minutes of debate.',
      didYouKnow: {
        show: true,
        insight: 'Product teams that prioritize based on data instead of opinions ship 2.3x more impactful features and have 50% fewer "why did we build this?" regrets. But gathering data manually takes so long that most PMs resort to gut feel—AI makes data-driven prioritization effortless.'
      },
      valueAddedSuggestion: {
        hours: 3.5,
        activity: 'Strategic Product Vision & Market Research',
        description: 'Develop long-term roadmap, conduct user research, analyze competitive landscape, define product strategy',
        expectedImpact: 'Builds differentiated product, captures larger market share, drives company valuation'
      },
      additionalImpactQuestions: []
    },
    {
      id: 2,
      title: 'Roadmap Communication & Stakeholder Alignment',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'quarterly',
      occurrencesPerYear: 4,
      timeMultiplier: 7.5,
      annualHoursFreed: 10.4,
      payrollFreed: 10.4 * hourlyRate,
      scenario: 'Quarterly roadmap review is next week. You need to present the Q2 roadmap to: CEO (wants strategic vision), sales (wants features that close deals), engineering (wants technical feasibility), customers (want their features), and customer success (wants reliability improvements). Each audience cares about different things and you need 5 different versions of the story.',
      oldWay: 'Build master roadmap in ProductPlan → Export to PowerPoint → Create CEO version: High-level strategic themes, business impact, competitive positioning (2 hours) → Create sales version: Feature list, target customers, deal impact, launch dates (90 minutes) → Create engineering version: Technical requirements, architecture decisions, dependencies (90 minutes) → Create customer version: Benefits-focused, avoid technical jargon, address their specific requests (2 hours) → Create CS version: Stability improvements, bug fixes, support impact (60 minutes) → Realize there are contradictions between versions → Go back and align messaging → Practice each presentation → Total prep time: 10+ hours spread over a week.',
      aiVoiceWay: 'Monday morning before quarterly reviews start, you say: "AIVA, create roadmap presentations for all stakeholders. Audiences: CEO, sales, engineering, customers, CS. Each needs tailored messaging, but overall story must be consistent. Include Q2 priorities, rationale, business impact, and timeline." In 30 minutes, AIVA provides: "5 roadmap presentations created: CEO version (strategic themes: enterprise expansion, AI capabilities, platform modernization, expected impact: $8M ARR opportunity), Sales version (12 features launching Q2 with deal alignment, Advanced analytics unlocks 8 pending deals worth $1.2M), Engineering version (technical architecture, 4 major initiatives, refactoring plan, capacity model), Customer version (benefit-focused messaging: You will be able to analyze data 10x faster with our new dashboard), CS version (15 stability improvements, 40% reduction in P1 incidents projected). Consistent core narrative across all versions, tailored details for each audience. All presentations ready." You review (45 minutes), customize tone and add anecdotes. Deliver 5 presentations across the week. All stakeholders: aligned.',
      didYouKnow: {
        show: true,
        insight: 'Misaligned stakeholders derail 40% of product roadmaps, causing scope changes, missed deadlines, and team frustration. PMs who invest in stakeholder alignment ship features 2x faster because there\'s no mid-sprint direction changes.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Deep Customer Research & Innovation',
        description: 'Conduct customer interviews, prototype new concepts, explore emerging needs, validate assumptions',
        expectedImpact: 'Discovers breakthrough product opportunities, builds customer loyalty, drives innovation'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Competitive Feature Analysis & Positioning',
      category: 'top5',
      baselineHours: 3.5,
      aiEnabledHours: 0.45,
      frequency: 'per major feature',
      occurrencesPerYear: 12,
      timeMultiplier: 7.8,
      annualHoursFreed: 36.6,
      payrollFreed: 36.6 * hourlyRate,
      scenario: 'Sales is losing deals because Competitor X launched a new AI-powered feature that customers love. Your CEO says: "We need to respond. How do we compete? Should we build the same thing? Something better? What\'s our strategy?" You need a recommendation by end of week.',
      oldWay: 'Research Competitor X\'s new feature: Watch their demo video, read product docs, sign up for free trial (takes 2 days for approval) → Test the feature yourself → Take notes on functionality → Read G2 reviews to see what customers think → Check 4 other competitors to see if they have similar features → Google "AI-powered features in [your category]" → Read 12 articles → Interview 5 customers: "Would you use this?" → Schedule 5 calls (takes 3 days) → Synthesize feedback → Talk to engineering: "How hard would this be to build?" → Engineering says "6 weeks" → Talk to data science team: "Do we have the AI capabilities?" → They say "Maybe, need to research" → Build recommendation doc: Should we build, buy, partner, or ignore? → Realize you need market sizing data → Google search for hours → Finally compile recommendation. Total time: 2 weeks, opportunity cost: competitors keep winning.',
      aiVoiceWay: 'CEO makes the request Monday morning. While walking to a meeting, you say: "AIVA, analyze Competitor X\'s new AI feature. How does it work? What do customers think? How does it compare to our capabilities? Should we build, buy, partner, or ignore? Include customer demand signals, competitive analysis, technical feasibility, and strategic recommendation." By Tuesday morning, AIVA provides: "Competitor X AI feature analysis: Functionality: Auto-generates insights from data using GPT-4, shows recommendations, predicts outcomes. Customer reception: 47 positive G2 reviews, 8 negative (accuracy concerns). Adoption: Est. 30% of their customers using it. Competitive landscape: 2 other competitors also launched similar features. Customer demand for you: 23 customer requests in last 60 days, 12 sales losses cited AI capabilities. Technical feasibility: Possible with your data infrastructure + OpenAI API integration, estimated 8 weeks engineering time, $15K/month API costs. Strategic recommendation: BUILD—this is table stakes in 12 months. Differentiation opportunity: Your data quality is better, so your AI insights could be more accurate than competitors. Roadmap impact: Delays Q3 Feature Y by 4 weeks. ROI: Estimated to save 3-5 deals/month worth $500K ARR. Detailed analysis and build plan ready." You review, socialize with leadership, decision made Wednesday: Build it. Engineering starts Friday.',
      didYouKnow: {
        show: true,
        insight: 'In competitive markets, responding to competitive threats 2 weeks faster can be the difference between losing 20% market share and maintaining leadership. But most PMs spend so long researching that by the time they make a recommendation, the market has moved on.'
      },
      valueAddedSuggestion: {
        hours: 3.05,
        activity: 'Strategic Partnerships & Ecosystem Development',
        description: 'Build integration partnerships, explore platform opportunities, develop ecosystem strategy',
        expectedImpact: 'Creates competitive moat, drives network effects, accelerates growth'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'User Research Synthesis & Insight Generation',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'per research cycle',
      occurrencesPerYear: 12,
      timeMultiplier: 7.5,
      annualHoursFreed: 31.2,
      payrollFreed: 31.2 * hourlyRate,
      scenario: 'You just completed 15 customer interviews about their workflow challenges (researching a new feature). You have 12 hours of recorded Zoom calls, handwritten notes from each session, screenshots they shared, and a messy Miro board with sticky notes. Your CEO wants insights by Friday to decide if we should build this feature. It\'s Wednesday.',
      oldWay: 'Re-watch all 12 hours of interview recordings (8x speed, still takes 90 minutes) → Take detailed notes → Realize you already took notes during the calls → Compare notes to recordings → Find contradictions → Re-watch sections to clarify → Manually categorize feedback themes: "Pain points, Current workarounds, Desired outcomes, Willingness to pay..." → Count how many people mentioned each theme → Build affinity diagram → Identify patterns → Try to quantify: "8 out of 15 said workflow takes 2+ hours daily" → Calculate potential impact → Realize you forgot to ask 3 people about budget → Email them → Wait for responses → Build insight synthesis document → Include representative quotes → Create user personas based on research → Draft feature requirements → Build business case. Total time: 6+ hours over 2 days.',
      aiVoiceWay: 'Wednesday morning, you say: "AIVA, analyze the 15 customer interviews about workflow challenges. Identify key pain points, current workarounds, feature requirements, willingness to pay, and recommend if we should build this feature. Include representative quotes and business case." In 35 minutes, AIVA provides: "User research synthesis (15 interviews, 12 hours of recordings): Key pain points: 1) Current workflow takes average 2.8 hours daily (all 15 mentioned time-consuming), 2) Data scattered across 3-5 systems requiring manual consolidation (12 of 15), 3) No mobile access forces them to be at desk (9 of 15), 4) Reporting requires manual Excel work (11 of 15). Current workarounds: 13 customers built custom spreadsheets, 7 hired VAs to handle data entry, 4 just accepted inefficiency. Desired outcomes: Unified dashboard (14 requests), mobile access (9), automated reports (13), real-time data (10). Willingness to pay: 11 would pay $5K-$15K annually for this solution, 3 would pay $15K-$25K, 1 unsure. Market sizing: If 15 interviews represent our 450-customer base, estimated 330 customers would adopt at avg $12K = $3.96M revenue opportunity. Recommendation: BUILD THIS FEATURE—clear pain, strong willingness to pay, $4M revenue potential. Estimated build cost: $180K (12 weeks, 3 engineers). ROI: 22:1 over 3 years. User personas, feature requirements doc, business case, and executive summary ready with supporting quotes." You review (30 minutes), present to CEO Thursday. CEO: "This is compelling. Let\'s build it."',
      didYouKnow: {
        show: true,
        insight: 'Product teams that synthesize user research within 48 hours make feature decisions 3x faster than those who take weeks. But manual synthesis is so tedious that many PMs either skip research or let insights sit for weeks—AI makes research instantly actionable.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Continuous Discovery & Customer Immersion',
        description: 'Conduct ongoing customer interviews, observe users in their environment, build deep empathy',
        expectedImpact: 'Discovers unmet needs before competitors, builds products customers love, drives word-of-mouth growth'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Go-to-Market Planning & Launch Coordination',
      category: 'top5',
      baselineHours: 3.5,
      aiEnabledHours: 0.45,
      frequency: 'per major launch',
      occurrencesPerYear: 8,
      timeMultiplier: 7.8,
      annualHoursFreed: 24.4,
      payrollFreed: 24.4 * hourlyRate,
      scenario: 'Your new AI-powered analytics feature launches in 3 weeks. You need to coordinate: Sales enablement (train 12 reps), marketing campaign (emails, blog posts, ads), customer communications (announce to 450 customers), CS training (prepare support team), pricing strategy (should we charge extra?), success metrics (how do we measure adoption?). Your CEO wants a comprehensive launch plan by Friday.',
      oldWay: 'Schedule launch planning meeting with sales, marketing, CS, and engineering → Takes 5 days to find a time → Facilitate 2-hour meeting → Everyone has different priorities and timelines → Take notes → Follow up individually with each team → Sales wants detailed product training → Schedule training session (another week to coordinate) → Deliver 2-hour training, create enablement materials → Marketing needs positioning and messaging → Draft messaging → Marketing wants changes → Revise → CS needs support documentation → Create docs → CS finds gaps → Revise → Engineering says feature isn\'t quite ready → Adjust timeline → Communicate delays to everyone → Rebuild launch plan → Pricing strategy: Should we charge? → Schedule meeting with finance → Still no decision → Finally launch with unclear pricing → Measure adoption: Realize you forgot to set up analytics tracking → Scramble to add tracking post-launch. Total time: 8+ hours over 2 weeks, launch is chaotic.',
      aiVoiceWay: 'Three weeks before launch, you say: "AIVA, create comprehensive go-to-market plan for AI analytics feature launch. Coordinate sales enablement, marketing campaign, customer communications, CS training, pricing recommendation, and success metrics." In 40 minutes, AIVA provides: "GTM plan for AI analytics launch (target date: Nov 15): Sales enablement: Training session scheduled Nov 8 (invites sent to 12 reps), enablement deck created (feature benefits, demo flow, objection handling, competitive positioning), battle cards ready, pricing cheat sheet included. Marketing campaign: Email sequence (3 emails to all 450 customers over 2 weeks), blog post drafted (How AI analytics saves 10 hours/week), LinkedIn ads creative ready ($15K budget, targeting analytics managers), press release drafted. Customer segmentation: 180 customers are ideal fit based on usage patterns—prioritize outreach. CS training: Support documentation created (15 KB articles), CS team training session Nov 7, FAQ prepared with 23 common questions. Pricing recommendation: Add $2K/month premium tier for AI features (analysis shows 30% of customers willing to pay, estimated $216K annual revenue). Success metrics dashboard configured: Track adoption rate, time-to-value, feature usage, customer satisfaction, revenue impact. Launch checklist: 47 tasks across 6 teams, dependencies mapped, owners assigned. All teams aligned." You review (30 minutes), refine details, send plan Thursday. Friday launch planning meeting: 30 minutes (everyone already aligned). Launch day: Smooth, coordinated, successful.',
      didYouKnow: {
        show: true,
        insight: 'Product launches coordinated across 5+ teams with clear plans see 3.1x higher adoption rates than chaotic launches. But coordinating complex launches manually creates so much overhead that many teams just "wing it"—AI orchestrates flawless launches while you focus on strategy.'
      },
      valueAddedSuggestion: {
        hours: 3.05,
        activity: 'Strategic Product Marketing & Analyst Relations',
        description: 'Build relationships with industry analysts, create category leadership, drive product PR',
        expectedImpact: 'Positions product as category leader, drives inbound demand, influences industry direction'
      },
      additionalImpactQuestions: []
    }
  ],

  'Supply Chain Manager': (hourlyRate) => [
    {
      id: 1,
      title: 'Inventory Optimization & Demand Forecasting',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.35,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 8.6,
      annualHoursFreed: 132.5,
      payrollFreed: 132.5 * hourlyRate,
      scenario: 'Monday morning review: You manage inventory for 1,200 SKUs across 4 warehouses. Your CFO is pushing to reduce inventory carrying costs (currently $2.8M tied up in inventory), but sales is complaining about stockouts that lost 3 customer orders last week. You need to optimize: hold less inventory without increasing stockouts.',
      oldWay: 'Export sales data from ERP system for last 12 months → Export inventory levels → Export lead times from supplier data → Open Excel → Calculate historical demand for each SKU → Build formulas for safety stock calculations → Try to account for seasonality (manually adjust for holidays, promotions, etc.) → Cross-reference with sales forecast → Sales forecast is in a different format, spend 30 minutes reformatting → Calculate reorder points → Identify slow-moving SKUs (inventory sitting for 6+ months) → Identify fast-moving SKUs at risk of stockout → Build recommendations: Reduce inventory on SKUs A, B, C, increase on SKUs X, Y, Z → Present to CFO → CFO asks "What\'s the cash impact?" → Go back and calculate. Takes 3 hours, final recommendation ready Tuesday.',
      aiVoiceWay: 'Monday morning at 8:30 AM, while reviewing the weekend shipments, you say: "AIVA, analyze inventory across all 4 warehouses. Identify opportunities to reduce carrying costs without increasing stockout risk. Include cash impact and specific SKU recommendations." In 25 minutes, AIVA responds: "Current inventory: $2.8M across 1,200 SKUs. Optimization opportunity: Reduce inventory by $420K (15%) with zero stockout risk increase. Slow-moving SKUs: 78 SKUs have 6+ months of excess inventory worth $280K—recommend clearance sale or return to suppliers. Fast-moving SKUs at risk: 12 SKUs projected to stock out in next 2 weeks (including top seller SKU-447)—reorder immediately. Seasonal adjustment: Increase inventory for 23 SKUs ahead of Q4 holiday season (demand typically increases 40%). Safety stock optimization: 34 SKUs are overstocked due to conservative calculations—reduce by 30%. Cash impact: Free up $420K in working capital, reduce carrying costs by $3,500/month. Detailed SKU-level recommendations ready." You review (15 minutes), approve recommendations, send instructions to warehouse team. Inventory optimized by 10 AM.',
      didYouKnow: {
        show: true,
        insight: 'Companies that optimize inventory weekly instead of monthly reduce carrying costs by 15-25% while improving service levels. But weekly optimization is only sustainable with AI—otherwise supply chain teams burn out on spreadsheet work.'
      },
      valueAddedSuggestion: {
        hours: 2.65,
        activity: 'Strategic Supplier Relationship Management',
        description: 'Negotiate better terms, develop alternative suppliers, build strategic partnerships',
        expectedImpact: 'Reduces supplier costs 10-20%, improves reliability, builds supply chain resilience'
      },
      additionalImpactQuestions: []
    },
    {
      id: 2,
      title: 'Logistics Disruption Response & Alternative Routing',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per disruption',
      occurrencesPerYear: 40,
      timeMultiplier: 8.3,
      annualHoursFreed: 88,
      payrollFreed: 88 * hourlyRate,
      scenario: 'It\'s 11:47 AM. Your logistics provider sends an urgent alert: "Port strike at Long Beach. Your shipment of 40,000 units (worth $380K) is stuck. ETA delayed 2-3 weeks." You have customers expecting delivery next week. If you miss delivery windows, you\'ll pay $75K in penalties.',
      oldWay: 'Panic → Call logistics provider: "What are my options?" → They say "We\'re working on it" (not helpful) → Check if there are alternative ports (Seattle? Oakland?) → Google "Port strike Long Beach alternative routing" → Call 4 different freight forwarders to ask about alternatives → Get quotes ranging from $18K to $47K → Not sure which is best → Check if you can air freight (too expensive for 40,000 units) → Consider rail + truck combination → Call trucking companies for quotes → Map out delivery timelines for each option → Calculate total costs including penalties → Try to negotiate with customers to extend delivery window → 2 customers refuse → Decision paralysis for 2.5 hours. By the time you decide, the best alternative is already booked by competitors.',
      aiVoiceWay: 'You see the port strike alert at 11:47 AM. While walking to a quiet room, you say: "AIVA, my shipment is stuck in Long Beach port strike. 40,000 units, $380K value, due next week. Find alternative routing options. Include cost, timeline, and risk assessment." In 20 minutes, AIVA responds: "Long Beach port strike alternatives: Option 1: Reroute to Port of Oakland, add 5 days transit, additional cost $23K, delivery by next Friday (1 day late, $15K penalty). Option 2: Split shipment—air freight 8,000 critical units, ocean freight rest to Oakland. Cost $41K, critical units arrive on time, rest 1 week late (partial penalty $28K). Option 3: Negotiate delivery extension with customers, no additional shipping cost. Past similar strikes lasted 8-12 days. Recommendation: Option 2—preserves relationships with top 2 customers, total cost $41K + $28K = $69K (vs $75K penalty for full delay). Freight forwarder partnerships available, capacity confirmed. Should I book Option 2 and draft customer communication?" You review, approve, shipments rerouted by 12:15 PM. Crisis managed in 28 minutes.',
      didYouKnow: {
        show: true,
        insight: 'Logistics disruptions cost companies an average of $184K per incident in delays, penalties, and customer churn. By responding 2+ hours faster with optimal alternatives, you minimize penalties and preserve customer relationships.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Supply Chain Risk Management & Resilience Planning',
        description: 'Build contingency plans, diversify suppliers and routes, develop early warning systems',
        expectedImpact: 'Reduces disruption impact by 60-80%, prevents costly emergency measures'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Supplier Performance Analysis & Negotiations',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'quarterly',
      occurrencesPerYear: 12,
      timeMultiplier: 7.5,
      annualHoursFreed: 31.2,
      payrollFreed: 31.2 * hourlyRate,
      scenario: 'Quarterly supplier review meeting next week with your top 3 suppliers (representing $4.2M annual spend). Your CFO wants to negotiate better terms: "Can we get 10% cost reduction? Better payment terms? How are they performing?" You need data to negotiate from a position of strength.',
      oldWay: 'Pull supplier performance data from ERP: on-time delivery rates, quality metrics, lead times → Export to Excel → Calculate metrics for each supplier → Realize data is messy (missing values, inconsistent formats) → Manually clean data → Compare performance vs SLAs → Check payment history → Review contracts to understand current terms → Research market rates (what are competitors paying?) → Google "average lead times for [category]" → Call 2 alternative suppliers to get competitive quotes → Build comparison analysis → Identify leverage points for negotiation → Draft negotiation strategy → Review with procurement team → Finalize approach. Takes 3+ hours of data work + meetings.',
      aiVoiceWay: 'Week before supplier meeting, you say: "AIVA, analyze performance for top 3 suppliers over last 12 months. Include on-time delivery, quality, lead times, cost trends, and recommend negotiation strategy. Benchmark against industry standards." In 30 minutes, AIVA provides: "Top 3 supplier analysis ($4.2M total spend): Supplier A ($1.8M): 87% on-time delivery (below SLA of 95%), 2.1% defect rate, lead time increasing 12% (now 6.8 weeks vs contracted 6 weeks). Leverage: They\'re underperforming SLA. Supplier B ($1.6M): 96% on-time, 0.4% defects, excellent performance. No quality leverage, but volume leverage—you represent 15% of their revenue. Supplier C ($800K): 91% on-time, but costs increased 8% in 12 months (market avg: 3%). Leverage: Price is above market. Negotiation recommendations: 1) Supplier A—demand 5% price reduction OR $90K service credit for SLA violations. 2) Supplier B—request 7% volume discount for contract extension + improved payment terms (60 days instead of 30 days frees $80K in working capital). 3) Supplier C—negotiate 5% price reduction to market rate ($40K annual savings). Total opportunity: $180K cost savings + $80K working capital improvement. Market benchmark data and negotiation talking points ready." You review, enter negotiation meeting fully prepared. Results: $140K savings negotiated.',
      didYouKnow: {
        show: true,
        insight: 'Procurement teams that negotiate with data-driven insights achieve 2.5x better cost reductions than those negotiating on relationships alone. But gathering supplier performance data takes so long that most negotiations happen with incomplete information.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Strategic Sourcing & Category Management',
        description: 'Evaluate new suppliers, explore global sourcing, optimize supplier mix, drive innovation',
        expectedImpact: 'Reduces total cost of ownership 15-25%, improves supply chain agility'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Demand-Supply Matching & Production Planning Coordination',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 8.3,
      annualHoursFreed: 110,
      payrollFreed: 110 * hourlyRate,
      scenario: 'Sales just closed 3 major deals requiring custom product configurations. Manufacturing says: "We need final specs by Wednesday to hit the delivery dates you promised." You need to translate customer requirements into production orders, check material availability, coordinate with 4 suppliers, and ensure production capacity exists.',
      oldWay: 'Read customer orders from Salesforce → Translate requirements into SKU specifications → Check bill of materials for each custom config → Realize 12 components needed → Check inventory for each component → Only 7 in stock → Check supplier lead times for missing 5 components → Call suppliers for quotes and availability → Supplier A: 3 weeks. Supplier B: 2 weeks but costs 20% more → Calculate cost implications → Check production schedule → Line 2 is booked for 6 weeks → Can we use Line 1? → Check Line 1 capabilities → Need special tooling → Contact tooling supplier → Build detailed production plan → Present to manufacturing → They find issues → Revise plan → Finally ready Wednesday afternoon (barely made it).',
      aiVoiceWay: 'Monday morning, you say: "AIVA, convert the 3 new custom orders into production plans. Check material availability, supplier lead times, production capacity, and create delivery timeline. Target customer delivery dates from sales team." In 25 minutes, AIVA provides: "Production plan for 3 custom orders: Order A (2,000 units, custom config X): Requires 12 components, 7 in stock, 5 need ordering. Supplier lead times: 2 weeks (can hit delivery date). Production Line 2 available week of Nov 20, estimated 3 days production time. Order B (1,500 units, config Y): All components in stock, Line 1 available immediately, 2 days production. Order C (800 units, config Z): Requires special tooling ($8K, 1-week lead time), components available, Line 2 week of Nov 27. Consolidated supplier orders: Component X (5,000 units from Supplier A, $23K, 2-week delivery), Component Y (3,000 units from Supplier B, $12K, immediate), Tooling T-47 ($8K, 1-week). Total material cost: $43K. All delivery dates achievable with current plan. Purchase orders drafted and ready for approval. Production schedule updated. Customer delivery commitments: Order A by Dec 1, Order B by Nov 15, Order C by Dec 8. Should I send POs to suppliers?" You review (15 minutes), approve. Production plan finalized Monday afternoon.',
      didYouKnow: {
        show: true,
        insight: 'Supply chain errors in demand-supply matching cost manufacturers an average of $85K per incident in rush fees, expedited shipping, or missed delivery penalties. By planning production 2 hours faster with AI, you eliminate errors and optimize costs.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic S&OP Process Development',
        description: 'Build sales & operations planning process, improve demand forecasting accuracy, optimize inventory turns',
        expectedImpact: 'Reduces inventory costs 20-30%, improves on-time delivery 40%, increases forecast accuracy'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Cost Reduction Analysis & Strategic Sourcing',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'quarterly',
      occurrencesPerYear: 4,
      timeMultiplier: 7.5,
      annualHoursFreed: 10.4,
      payrollFreed: 10.4 * hourlyRate,
      scenario: 'Your CFO says: "We need to reduce supply chain costs by 15% next year. Where are the opportunities? I need a detailed cost reduction plan for the board meeting in 2 weeks." You spend $8.4M annually with 47 suppliers across 1,200 SKUs.',
      oldWay: 'Export spend data by supplier → Sort by spend → Identify top 20 suppliers (80% of spend) → Research each supplier: Can we negotiate better rates? Are there alternatives? → Google alternative suppliers → Find 12 potential alternatives → Request quotes (takes a week to get responses) → Compare quotes to current costs → Identify savings opportunities → Check supplier contracts for renegotiation clauses → Some contracts locked for 2 more years → Build category analysis: Raw materials (40% of spend), packaging (25%), logistics (20%), other (15%) → Where can we save? → Consider bulk purchasing discounts → Calculate volume-based savings → Consider multi-sourcing to increase competition → Calculate risk vs reward → Build detailed cost reduction plan: Initiative 1: Renegotiate with Supplier A ($15K savings), Initiative 2: Switch to Supplier B for Category X ($45K savings)... → Present to procurement team → They have concerns about 3 initiatives → Revise → Finally ready. Total time: 8+ hours over 2 weeks.',
      aiVoiceWay: 'Monday after CFO request, you say: "AIVA, analyze our $8.4M supplier spend and identify cost reduction opportunities totaling 15% ($1.26M). Include renegotiation opportunities, alternative sourcing, volume consolidation, and risk assessment." In 35 minutes, AIVA provides: "Cost reduction analysis (47 suppliers, $8.4M annual spend): Top opportunities totaling $1.34M (16% reduction): 1) Renegotiate with top 5 suppliers ($780K opportunity)—Supplier A: paying 12% above market for raw materials, leverage: We represent 18% of their revenue. Supplier B: logistics costs increased 15% but market rates only up 6%. 2) Alternative sourcing ($340K)—Switch packaging supplier from Supplier C to Supplier D (same quality, 18% lower cost, vetted by 3 references). 3) Volume consolidation ($145K)—Currently buying Component X from 3 suppliers, consolidate to 1 supplier for 22% volume discount. 4) Payment terms optimization ($75K working capital improvement)—Extend payment terms with 4 suppliers from 30 to 60 days. Risk assessment: Alternative sourcing has 3-month transition period, volume consolidation creates single-source dependency (mitigation: add backup supplier). Implementation timeline: Q1 renegotiations, Q2 supplier transitions, full savings realized by Q3. Detailed cost reduction plan with negotiation talking points ready." You review (30 minutes), validate with procurement team, present to CFO Thursday. CFO: "This is excellent. Let\'s execute."',
      didYouKnow: {
        show: true,
        insight: 'Supply chain cost reduction initiatives that take 2 weeks to develop get implemented 3x faster than those that take months—because leadership can act quickly while opportunities are fresh. AI-powered analysis compresses months of research into hours.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Strategic Sourcing Transformation & Supplier Innovation',
        description: 'Develop supplier innovation partnerships, explore nearshoring opportunities, build supply chain resilience',
        expectedImpact: 'Reduces costs 20-30% while improving reliability, positions supply chain as competitive advantage'
      },
      additionalImpactQuestions: []
    }
  ],

  'Quality Assurance Manager': (hourlyRate) => [
    {
      id: 1,
      title: 'Test Case Prioritization & Coverage Analysis',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per release',
      occurrencesPerYear: 24,
      timeMultiplier: 8.3,
      annualHoursFreed: 52.8,
      payrollFreed: 52.8 * hourlyRate,
      scenario: 'Major release goes out Friday. Your QA team has 2,847 test cases, but only 2 days to test. Engineering made 147 code changes across 23 files. Product says "We MUST ship Friday for a customer commitment." You need to prioritize which tests are critical vs which can be skipped.',
      oldWay: 'Review the 147 code changes → Try to understand which features are affected → Open test management system (TestRail? Zephyr?) → Manually map code changes to test cases → Some test cases are outdated and haven\'t been updated → Ask developers "What could break from your changes?" → Half don\'t respond → Categorize tests: P0 (critical), P1 (high), P2 (medium), P3 (low) → Realize P0 and P1 together are still 800+ test cases (takes 3 days to run) → Try to identify regression risk → Look at past bug history to see what breaks often → Build prioritized test plan → Present to team → Engineering says "You\'re testing feature X but we didn\'t even change that code" → Revise plan. Takes 2.5 hours, still not confident you\'re testing the right things.',
      aiVoiceWay: 'Wednesday morning, release is Friday, you say: "AIVA, analyze the 147 code changes for Friday\'s release. Map to test cases, prioritize by risk, and create a 2-day test plan." In 20 minutes, AIVA responds: "147 code changes analyzed. High-risk areas: 1) Payment processing (23 files changed, historically 15% of P1 bugs occur here)—prioritize 147 related test cases. 2) User authentication (12 files changed, security-critical)—prioritize 89 test cases. 3) API integrations (8 files changed, customer-facing)—prioritize 52 test cases. Medium-risk: Dashboard UI changes (34 files, low historical bug rate)—run 120 regression tests. Low-risk: Admin tools (70 files, internal only)—skip detailed testing, smoke test only. Recommended 2-day test plan: Day 1: 288 critical tests (payment, auth, API). Day 2: 120 regression tests + smoke tests. Total: 408 tests (manageable in 2 days). Risk assessment: Covers 94% of critical paths, acceptable release risk. Automated test suite can cover 60% of these—recommend running overnight. Manual test plan ready." You review (15 minutes), assign to team, testing begins Wednesday afternoon. Release: Friday on schedule, zero critical bugs found post-launch.',
      didYouKnow: {
        show: true,
        insight: 'QA teams that prioritize testing based on risk analysis catch 3x more critical bugs than those who test everything equally. But risk analysis takes so long manually that most teams resort to "test what we can" instead of "test what matters most."'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Test Automation Strategy & Infrastructure',
        description: 'Build automated test frameworks, improve CI/CD pipelines, reduce manual testing burden',
        expectedImpact: 'Increases test coverage 50-80%, reduces release cycle time, catches bugs earlier'
      },
      additionalImpactQuestions: []
    },
    {
      id: 2,
      title: 'Defect Triage & Severity Assessment',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.20,
      frequency: 'daily',
      occurrencesPerYear: 250,
      timeMultiplier: 7.5,
      annualHoursFreed: 325,
      payrollFreed: 325 * hourlyRate,
      scenario: 'Monday morning: 47 new bugs reported over the weekend (from customers, internal testing, and automated monitoring). Engineering morning standup starts in 30 minutes and they want to know: Which bugs need immediate attention? Which can wait? What\'s blocking release?',
      oldWay: 'Open bug tracking system (JIRA? GitHub Issues?) → Read through all 47 bug reports one by one → Many reports are vague: "App crashed" with no details → Try to reproduce bugs → Can\'t reproduce 12 of them → Assign severity levels: P0 (critical), P1, P2, P3 → Not sure which severity for some → Check if bugs are duplicates → Find 6 duplicates → Merge them → Assign to engineering team members → Some engineers already have full plates → Re-assign → Realize 3 bugs might be blockers for Friday release → Tag them as "Release Blocker" → Prepare summary for standup. Done at 9:32 AM (standup started at 9:15, you\'re late and unprepared).',
      aiVoiceWay: 'Monday at 8:45 AM (30 minutes before standup), while making coffee, you say: "AIVA, triage the weekend bugs. Classify by severity, identify duplicates, flag release blockers, and assign to appropriate team members based on current workload." In 12 minutes, AIVA responds: "47 bugs triaged: 2 P0 (critical): Bug #2847—payment processing failure affects 5% of transactions, started Saturday 3 PM. Bug #2851—login broken for users with special characters in username. Assign both to payment team immediately. 8 P1 (high priority): Including 3 potential release blockers—bugs affecting new feature launching Friday. Assign to feature owner Sarah. 18 P2 (medium): Standard bugs, can be scheduled for next sprint. 13 P3 (low): Minor UI issues, low priority. 6 duplicates merged. Team assignments: 12 bugs to Team A (current capacity: 15 hours available), 8 to Team B (capacity: 12 hours), 6 to Team C. Cannot reproduce: 4 bugs need more info from reporters—auto-requested details. Standup summary ready: 2 critical bugs need immediate attention, 3 release blockers for review." You walk into standup at 9:15 fully prepared. Engineering appreciates the clear priorities.',
      didYouKnow: {
        show: true,
        insight: 'Unorganized bug triage causes engineering teams to waste 30-40% of their time working on low-priority bugs while critical issues go unnoticed. Fast, accurate triage in 12 minutes instead of 90 minutes gets critical bugs fixed hours faster.'
      },
      valueAddedSuggestion: {
        hours: 1.3,
        activity: 'Root Cause Analysis & Quality Process Improvement',
        description: 'Analyze bug patterns, identify systemic issues, improve development processes to prevent bugs',
        expectedImpact: 'Reduces bug volume by 40-60%, improves product quality, builds culture of quality'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Release Readiness Reporting',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per release',
      occurrencesPerYear: 24,
      timeMultiplier: 8.0,
      annualHoursFreed: 42,
      payrollFreed: 42 * hourlyRate,
      scenario: 'Thursday afternoon. Release is scheduled for tomorrow (Friday) at 2 PM. Your VP of Engineering asks: "Are we ready to ship? What\'s our test coverage? Any open P0/P1 bugs? What\'s the risk level?" You need a clear go/no-go recommendation.',
      oldWay: 'Check test management system for test execution status → 847 tests planned, 798 executed, 49 remaining → Check which tests are incomplete → Some are blocked by bugs → Check bug tracking: 3 P1 bugs still open → Are they release blockers? → Read through each bug → Talk to engineering about status → Check code coverage metrics → Pull report from CI/CD pipeline → Coverage is 78% (below team\'s 80% goal) → Check if any critical features have low coverage → Manually investigate → Build release readiness report: "798 of 847 tests passed, 3 P1 bugs open but not blockers, code coverage 78% (slightly low)..." → Not sure if you should recommend go or no-go → Schedule meeting with eng lead to discuss → Finally agree: Go with caveat. Report ready 2 hours later.',
      aiVoiceWay: 'Thursday at 3 PM, you say: "AIVA, generate release readiness report for tomorrow\'s release. Include test coverage, open bugs, risk assessment, and go/no-go recommendation." In 15 minutes, AIVA responds: "Release readiness for Friday 2 PM: Test execution: 798 of 847 tests passed (94%). 49 tests incomplete: 23 low-priority UI tests (acceptable to skip), 18 blocked by known bugs (non-critical), 8 need regression testing (can complete tomorrow morning). Open bugs: 3 P1 bugs—Bug #2901 (search performance issue, workaround available, can fix post-release), Bug #2897 (edge case in reporting, affects <1% users, low risk), Bug #2899 (mobile UI alignment, cosmetic only). No P0 bugs. Code coverage: 78.4% overall, but critical paths at 92% (payment, auth, core features well covered). Risk assessment: LOW. Similar releases with this profile had 0.2% incident rate post-launch. Recommendation: GO for release. Contingency: Monitor payment and auth systems closely for 48 hours post-launch. Release checklist and rollback plan ready." You review, present to VP at 3:20 PM. VP says "Great report, let\'s ship." Release: approved.',
      didYouKnow: {
        show: true,
        insight: 'Delayed release decisions cost companies an average of $50K-$200K per day in lost revenue and customer impact. By providing clear, confident release recommendations in 15 minutes instead of 2 hours, you ship features faster while maintaining quality.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Quality Metrics & Continuous Improvement',
        description: 'Build quality dashboards, track trends, establish quality standards, drive team quality culture',
        expectedImpact: 'Reduces production incidents by 50-70%, improves team velocity, builds trust with customers'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Test Automation ROI Analysis & Tool Selection',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'per initiative',
      occurrencesPerYear: 4,
      timeMultiplier: 7.5,
      annualHoursFreed: 10.4,
      payrollFreed: 10.4 * hourlyRate,
      scenario: 'Your VP of Engineering says: "We need to increase test automation from 40% to 80% coverage. Research tools and create a plan. I need ROI justification and implementation timeline for budget approval next month." You have dozens of test automation tools to evaluate: Selenium, Cypress, Playwright, TestCafe, Puppeteer...',
      oldWay: 'Google "best test automation tools 2024" → Read 15 comparison articles → Sign up for free trials of 6 tools → Spend 2 hours testing each tool → Some don\'t work with your tech stack → Read documentation → Watch tutorial videos → Check pricing: Some are free, some are $50K/year → Try to calculate ROI: How much time will automation save? → Estimate current manual testing time → Estimate automation coverage possible → Build savings model → Realize you need engineering time to build tests → Ask engineering: "How long to automate 500 test cases?" → Get vague answer: "Depends, maybe 6 months?" → Try to build implementation plan → Lots of assumptions → Build comparison matrix → Still not sure which tool to choose → Ask for team input → Everyone has different opinions → Debate for a week → Finally choose Cypress → Build ROI doc → Present for approval. Total time: 8+ hours over 3 weeks.',
      aiVoiceWay: 'Monday after VP request, you say: "AIVA, evaluate test automation tools for our stack (React, Node.js, PostgreSQL). We need to go from 40% to 80% coverage. Include tool comparison, ROI analysis, implementation plan, and timeline. Budget approval needed next month." In 35 minutes, AIVA provides: "Test automation analysis: Current state: 40% coverage, 847 manual test cases, 3 QA engineers spending 60% time on manual testing. Target: 80% coverage. Tool evaluation: Playwright recommended (best for our React/Node stack, fastest execution, free and open-source). Alternative: Cypress (easier learning curve, $50K annual cost). Implementation plan: Phase 1 (Month 1-2): Automate critical path tests (200 tests, 30% coverage gain). Phase 2 (Month 3-4): Automate regression tests (180 tests, additional 25% coverage). Phase 3 (Month 5-6): Automate edge cases (120 tests, reach 80% total). Resource requirements: 1 engineer dedicated for 6 months + 1 QA engineer 50% time. ROI calculation: Current manual testing: 3 QA engineers × 60% time × $75/hour × 2,080 hours = $280K annually. Post-automation: 3 QA engineers × 20% time on manual = $93K annually. Annual savings: $187K. Implementation cost: $120K (6 months eng time). Payback period: 7.7 months. 3-year ROI: 366%. Additional benefits: Faster release cycles (weekly instead of bi-weekly), earlier bug detection (shift-left testing), improved product quality. Tool recommendation: Playwright. Implementation timeline and budget request ready." You review (30 minutes), present to VP. VP: "This is exactly what I needed. Approved."',
      didYouKnow: {
        show: true,
        insight: 'Test automation initiatives that clearly demonstrate ROI get approved 4.2x more often than those presenting just technical benefits. But building ROI models manually takes so long that most QA managers present weak justifications—AI provides bulletproof business cases.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Quality Engineering & Shift-Left Testing Culture',
        description: 'Build test-driven development practices, implement CI/CD quality gates, coach developers on testing',
        expectedImpact: 'Reduces bugs reaching production by 60-80%, accelerates release velocity, builds quality culture'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Quality Metrics Reporting & Trend Analysis',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'monthly',
      occurrencesPerYear: 12,
      timeMultiplier: 8.0,
      annualHoursFreed: 21,
      payrollFreed: 21 * hourlyRate,
      scenario: 'Monthly product quality review is tomorrow. Your VP of Product wants: defect trends, test coverage by feature area, release quality metrics, production incident analysis, and recommendations for improvement. Data is scattered across JIRA, test management system, monitoring tools, and support tickets.',
      oldWay: 'Pull defect data from JIRA for last 30 days → Export to Excel → Categorize by severity, feature area, root cause → Build pivot tables → Create trend charts → Pull test coverage from CI/CD → Some features show 90% coverage, others 30% → Manually investigate why → Pull production incident data from monitoring tools → Count incidents by severity → Cross-reference with releases to see which release caused which incident → Pull customer-reported bugs from support tickets → Merge data from 4 sources → Find duplicates → Build quality metrics dashboard → Calculate: defect density, test coverage, mean time to resolution, escape rate → Compare to last month → Identify trends → Write recommendations → Format everything for presentation. Total time: 4+ hours, still finding issues in the data.',
      aiVoiceWay: 'Day before quality review, you say: "AIVA, create monthly quality metrics report. Include defect trends, test coverage, production incidents, and recommendations for improvement." In 20 minutes, AIVA provides: "Quality metrics report (October): Defects: 47 bugs found (vs 62 last month, -24% improvement). Severity: 2 P0, 8 P1, 23 P2, 14 P3. Root causes: 38% requirements issues, 28% code defects, 22% integration bugs, 12% environmental. Feature area analysis: Payment module highest defect density (2.3 bugs per KLOC), Dashboard lowest (0.4 bugs per KLOC). Test coverage: Overall 78%, but Payment only 62% (explains high defects). Production incidents: 3 P1 incidents in October (vs 7 last month, -57%). All incidents related to Sept 28 release. Mean time to resolution: 4.2 hours (vs 6.8 hours last month, improving). Customer-reported bugs: 12 (vs 18 last month). Escape rate: 25% (bugs found in production vs total bugs, target <20%). Trends: Quality improving across all metrics. Recommendations: 1) Increase payment module test coverage to 85% (prevent defects), 2) Implement integration testing in pre-prod environment (reduce integration bugs by 50%), 3) Add performance testing to release checklist (prevent incidents). Quality metrics dashboard and executive summary ready." You review (15 minutes), present next day. Team: aligned on improvements.',
      didYouKnow: {
        show: true,
        insight: 'Teams that review quality metrics monthly and act on trends reduce production incidents by 50-70% year over year. But building quality reports manually takes so long that most teams only do it quarterly (or when forced)—AI makes monthly quality reviews effortless.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Quality Strategy & Industry Best Practices',
        description: 'Research emerging quality methodologies, attend conferences, bring best practices to team',
        expectedImpact: 'Positions team as quality leader, drives continuous improvement, builds engineering excellence'
      },
      additionalImpactQuestions: []
    }
  ],

  'IT Support Specialist': (hourlyRate) => [
    {
      id: 1,
      title: 'Ticket Prioritization & Knowledge Base Search',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.15,
      frequency: 'daily',
      occurrencesPerYear: 250,
      timeMultiplier: 10.0,
      annualHoursFreed: 337.5,
      payrollFreed: 337.5 * hourlyRate,
      scenario: 'Monday morning at 8:00 AM. You open your support queue: 73 new tickets from the weekend. Your SLA says P1 tickets must be responded to within 1 hour. You see 8 tickets marked P1, 27 marked P2, 38 marked P3. But you know from experience that users often mark everything as P1 even when it\'s not urgent. You need to figure out what\'s truly critical and respond fast.',
      oldWay: 'Open ServiceNow (or Zendesk, Freshdesk) → Read through all 73 tickets → Realize "P1: Can\'t print" is not actually P1 (user just doesn\'t know how to select printer) → Realize "P3: All systems down" is mis-labeled and should be P0 → Re-prioritize tickets manually → Start working on true P1 tickets → First ticket: "Outlook not syncing" → Search knowledge base → Find 4 articles, not sure which applies → Read through all 4 → Try solution from Article 2 → Doesn\'t work → Try solution from Article 4 → Works! → Document solution in ticket → Next ticket: "VPN connection failing" → Search KB again → Takes 90 minutes to get through 8 P1 tickets, falling behind SLA.',
      aiVoiceWay: 'Monday at 8:00 AM, while walking to your desk, you say: "AIVA, triage all weekend tickets. Re-prioritize by true urgency, flag any mis-categorized tickets, and provide solution suggestions from the knowledge base for each P1 ticket." In 10 minutes, AIVA responds: "73 tickets triaged. 3 true P0 (critical): Ticket #8472—email server down for finance team (12 users affected), Ticket #8479—CEO laptop won\'t boot (executive blocker), Ticket #8481—production database connection failing (affects customer-facing app). 5 true P1 (high): Including VPN issues, Outlook sync problems. 6 tickets mis-labeled as P1 (re-categorized to P2/P3). Solutions from KB: Ticket #8479—likely disk corruption, KB article #247 has 90% success rate (run disk repair). Ticket #8481—check database connection pool settings, KB article #892. Ticket #8483 (Outlook sync)—mailbox over quota, KB article #134. Should I auto-respond to P2/P3 tickets with KB articles and assign P0/P1 to your team?" You say "Yes." You focus on the 3 P0 tickets immediately, resolving them by 9:15 AM. SLA: maintained.',
      didYouKnow: {
        show: true,
        insight: 'IT support teams that triage tickets with AI respond to critical issues 45 minutes faster on average, preventing small problems from becoming company-wide outages. Fast response directly correlates with employee productivity and satisfaction.'
      },
      valueAddedSuggestion: {
        hours: 1.35,
        activity: 'Proactive IT Infrastructure Monitoring',
        description: 'Monitor systems for early warning signs, fix issues before users report them, prevent outages',
        expectedImpact: 'Reduces ticket volume by 30-50%, improves uptime, shifts from reactive to proactive IT'
      },
      additionalImpactQuestions: []
    },
    {
      id: 2,
      title: 'Multi-System Troubleshooting & Diagnostic Guidance',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per complex issue',
      occurrencesPerYear: 100,
      timeMultiplier: 8.0,
      annualHoursFreed: 175,
      payrollFreed: 175 * hourlyRate,
      scenario: 'A user calls: "I can\'t access the customer database. I\'ve tried 3 times and it keeps saying \'Connection timeout.\' This is urgent—I have a customer on the phone waiting for information!" You need to diagnose: Is it their laptop? Network? VPN? Firewall? Database server? Permissions?',
      oldWay: 'Ask user: "Can you access other systems?" → User says "Yes, email works" → Check if VPN is connected → User says yes → Remote into their laptop → Try to connect to database yourself → Same error → Check network connectivity: ping database server → Ping works → Try traceroute → Looks normal → Check firewall rules → Everything looks correct → Check database server status → Server is up → Check database logs → Nothing obvious → Check user\'s permissions → Permissions look correct → Search Google "database connection timeout troubleshooting" → Try 5 different solutions → Finally discover: Database connection pool is exhausted (too many open connections) → Restart database connection pool → Problem solved. Total time: 2 hours. User\'s customer hung up 90 minutes ago.',
      aiVoiceWay: 'User reports the issue at 10:15 AM. While on the phone with them, you say: "AIVA, diagnose database connection timeout issue for Sarah\'s laptop. She can access email but not customer database." In 15 seconds, AIVA responds: "Diagnostic analysis: Network connectivity: ✓ Normal. VPN connection: ✓ Active. Firewall rules: ✓ Correct. User permissions: ✓ Valid. Database server status: ⚠️ Connection pool at 98% capacity (147 of 150 connections in use). Root cause: Connection pool exhaustion—likely caused by long-running queries not releasing connections. Immediate fix: Restart database connection pool service (will disconnect active users for 10 seconds). Long-term fix: Increase pool size from 150 to 250 connections and configure 30-minute connection timeout. KB article #567 has step-by-step instructions. Estimated resolution time: 2 minutes." You restart the connection pool, user reconnects successfully at 10:18 AM (3 minutes total). User says "Thank you! Customer is still on hold—I can help them now."',
      didYouKnow: {
        show: true,
        insight: 'Complex IT issues typically require checking 10-15 possible causes, taking 1-2 hours per issue. AI diagnosis cuts this to 1-2 minutes by instantly checking all possibilities simultaneously, allowing IT teams to resolve 95% of issues within 15 minutes.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'IT Training & Self-Service Enablement',
        description: 'Create training materials, build self-service tools, empower users to solve common issues',
        expectedImpact: 'Reduces ticket volume by 40-60%, improves user satisfaction, frees IT for strategic work'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'User Training & Documentation Creation',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'per new system/update',
      occurrencesPerYear: 20,
      timeMultiplier: 7.5,
      annualHoursFreed: 52,
      payrollFreed: 52 * hourlyRate,
      scenario: 'Your company is rolling out a new expense reporting system next month. 280 employees need to be trained. Your CFO says: "We need training materials: a quick-start guide, detailed documentation, and FAQ. Can you create this by next week?" You\'ve never used the new system yourself.',
      oldWay: 'Sign up for the new expense system → Spend 2 hours clicking through every feature → Take screenshots → Open Word document → Write step-by-step instructions for each task: "How to submit an expense report, How to attach receipts, How to request reimbursement..." → Realize you forgot to document the approval workflow → Log back in and explore → Add more screenshots → Format document → Try to anticipate questions users will ask → Build FAQ section → Realize documentation is too long (47 pages)—nobody will read it → Create shorter "Quick Start Guide" (8 pages) → Design is ugly → Send to colleague for review → They find 6 errors → Fix errors → Export to PDF. Total time: 6-8 hours over 3 days.',
      aiVoiceWay: 'Monday morning, you say: "AIVA, create training materials for our new expense reporting system. Include quick-start guide, detailed documentation, and FAQ covering common questions. Make it beginner-friendly." While you spend 30 minutes exploring the new system yourself to understand it, AIVA prepares: "Expense system training materials created: Quick Start Guide (3 pages): Submit expense report in 5 steps with screenshots, attach receipts, track status. Detailed Documentation (15 pages): Complete workflows for employees, managers (approvals), finance (reimbursements), admin (system configuration). FAQ (23 questions): How do I handle foreign currency expenses? What if I lost a receipt? How long does reimbursement take? (answers based on system settings and company policy). Formatted in your company template, includes screenshots, beginner-friendly language. Ready to distribute." You review (45 minutes), make minor adjustments, add company-specific policies. Training materials approved by Tuesday afternoon. Total time: 90 minutes instead of 8 hours.',
      didYouKnow: {
        show: true,
        insight: 'Poor software training causes 40% of new system implementations to fail or have low adoption. But IT teams spend so long creating training materials that they often ship late or skip training altogether—AI makes comprehensive training effortless.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'IT Strategy & Infrastructure Modernization',
        description: 'Evaluate new technologies, plan cloud migrations, improve security posture, drive innovation',
        expectedImpact: 'Reduces IT costs 20-30%, improves security, enables business growth'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'System Upgrade Planning & Change Management',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'per major upgrade',
      occurrencesPerYear: 12,
      timeMultiplier: 7.5,
      annualHoursFreed: 31.2,
      payrollFreed: 31.2 * hourlyRate,
      scenario: 'Microsoft announces: "Windows 10 support ends in 6 months. Migrate to Windows 11 or risk security vulnerabilities." You have 180 company laptops to upgrade. Your CTO asks: "What\'s the plan? Will everything work? What\'s the impact on users? How long will this take?" You need a comprehensive upgrade plan.',
      oldWay: 'Research Windows 11 requirements → Check if current laptops meet specs → Manually check 180 laptop models → Find 23 laptops don\'t meet requirements (need hardware upgrades or replacement) → Calculate costs: New laptops $1,200 each = $27.6K → Check software compatibility: Will our 47 business applications work on Windows 11? → Test each application → Find 4 applications have compatibility issues → Research workarounds or alternatives → Build upgrade timeline → User communication plan → Realize you need to coordinate with 12 departments → Schedule meetings → Users have questions → Build FAQ → Create backup plan → Pilot test with 10 users → Find issues → Revise plan. Total time: 8+ hours over 2 weeks.',
      aiVoiceWay: 'Monday after Microsoft announcement, you say: "AIVA, create Windows 11 upgrade plan for our 180 company laptops. Check hardware compatibility, software compatibility, estimate costs, build timeline, and create user communication plan." In 30 minutes, AIVA provides: "Windows 11 upgrade plan: Hardware audit: 157 laptops meet requirements, 23 need hardware upgrades ($27.6K cost for replacements). Software compatibility: Tested 47 applications—43 fully compatible, 4 have issues: App A (critical accounting software, Windows 11 compatible version available, free upgrade), App B (legacy CRM, no Windows 11 support, recommend migrate to cloud version $8K), App C and D (minor tools, alternatives available). Upgrade timeline: Phase 1 (Weeks 1-2): Pilot with IT team (10 laptops), validate compatibility. Phase 2 (Weeks 3-6): Upgrade by department (30 laptops/week), minimize disruption. Phase 3 (Weeks 7-8): Upgrade remaining 23 laptops with hardware replacements. Total project: 8 weeks. User communication: Email templates ready (what to expect, how to prepare, backup your data, support available). Training materials: 15-minute video walkthrough of Windows 11 changes. Support plan: Dedicated Slack channel, priority ticket handling during upgrades. Total cost: $35.6K (hardware + software migrations). Risk assessment: Low—pilot testing validates approach. Detailed project plan, Gantt chart, and budget request ready." You review (20 minutes), present to CTO Tuesday. CTO: "Great plan. Let\'s proceed."',
      didYouKnow: {
        show: true,
        insight: 'IT upgrade projects with clear plans and user communication have 3.5x higher success rates than rushed migrations. But planning comprehensive upgrades manually takes so long that many IT teams skip planning and create chaos—AI delivers thorough plans in minutes.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'IT Strategy & Digital Transformation Leadership',
        description: 'Evaluate cloud migration, implement zero-trust security, modernize IT infrastructure',
        expectedImpact: 'Reduces IT costs 25-40%, improves security posture, enables business agility'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Security Incident Response & Compliance Reporting',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'per incident',
      occurrencesPerYear: 20,
      timeMultiplier: 8.3,
      annualHoursFreed: 44,
      payrollFreed: 44 * hourlyRate,
      scenario: 'Monday 10:47 AM: Your security monitoring alerts: "Unusual login activity detected—employee account accessed from IP address in Russia. Possible compromise." This could be a breach. You need to respond immediately: Verify if it\'s legitimate, contain the threat, assess damage, report to leadership, and document everything for compliance.',
      oldWay: 'Check security logs → See 47 login attempts from Russian IP → Contact employee: "Did you log in from Russia?" → Employee says "No, I\'m in California" → Account compromised → Immediately disable account → Check what systems the compromised account accessed → Review audit logs → Account accessed: Email (Gmail), Salesforce, AWS console, internal wiki → Check if any data was downloaded → Email logs show 12 emails forwarded to external address → Check Salesforce: 200 customer records viewed → Check AWS: No resources created or modified → Assess damage → Notify security team → Notify legal → Notify CEO → Document incident timeline → Check compliance requirements (GDPR? SOC 2?) → Need to notify affected customers? → Research notification requirements → Draft incident report → Implement remediation: Reset all passwords, enable 2FA, add IP blocking rules. Total time: 2.5 hours of high-stress incident response.',
      aiVoiceWay: 'You see the security alert at 10:47 AM. While walking to a private room, you say: "AIVA, analyze the security incident with employee account accessed from Russia. Assess compromise severity, identify what was accessed, recommend containment steps, and prepare compliance notifications." In 18 minutes, AIVA responds: "Security incident analysis: Compromised account: John Smith (Sales Manager). Attack timeline: 47 login attempts starting 10:42 AM from Russian IP, successful on attempt 23 (weak password). Systems accessed: Gmail (12 emails forwarded to external address—all contained non-sensitive internal communications), Salesforce (200 customer records viewed—names and emails only, no financial data), AWS console (view-only access, no changes made), internal wiki (viewed 8 pages of sales playbooks). Data exposure: Limited—200 customer email addresses compromised. GDPR impact: Medium—recommend notifying 200 affected EU customers within 72 hours. SOC 2 impact: Reportable incident, document for auditors. Containment steps completed: Account disabled, password reset link sent, forced 2FA enrollment, Russian IP range blocked. Recommended additional actions: 1) Enable 2FA for all sales team accounts (prevent future compromises), 2) Audit all accounts with weak passwords, 3) Implement geo-blocking for non-US logins. Incident report drafted for CEO, legal, and compliance. Customer notification templates ready. Total damage: Minimal (no financial data exposed). Incident contained in 15 minutes." You review, execute remaining steps, incident fully resolved and documented by 11:20 AM.',
      didYouKnow: {
        show: true,
        insight: 'Security incidents that are contained within 1 hour cause 70% less damage than those that linger for 2+ hours. But manual incident investigation takes so long that threats can escalate—AI provides instant threat analysis and containment recommendations.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Proactive Security Posture & Zero-Trust Implementation',
        description: 'Build security monitoring dashboards, implement zero-trust architecture, conduct security training',
        expectedImpact: 'Prevents 80% of security incidents before they occur, improves compliance, protects company data'
      },
      additionalImpactQuestions: []
    }
  ],

  'Business Development Manager': (hourlyRate) => [
    {
      id: 1,
      title: 'Partnership Opportunity Evaluation & ROI Analysis',
      category: 'top5',
      baselineHours: 3.5,
      aiEnabledHours: 0.45,
      frequency: 'per opportunity',
      occurrencesPerYear: 30,
      timeMultiplier: 7.8,
      annualHoursFreed: 91.5,
      payrollFreed: 91.5 * hourlyRate,
      scenario: 'A potential partner (TechPartner Inc) reaches out: "We have 5,000 customers who could benefit from your product. Let\'s discuss a partnership." Your CEO is excited and asks: "Is this worth pursuing? What\'s the revenue potential? What resources would we need to commit?" You need a recommendation by Friday\'s exec meeting.',
      oldWay: 'Research TechPartner Inc: Check their website, LinkedIn, funding history → Research their customer base: What industries? Company sizes? → Try to estimate overlap with your ICP → Google "partnership revenue models" → Consider options: Referral partnership? Reseller? Technology integration? Co-marketing? → Try to estimate revenue potential: If they have 5,000 customers, maybe 10% would buy? Average deal size $50K? = $25M potential? (wild guess) → Research integration complexity: Check their API docs → Realize integration would require 2 engineers for 3 months → Calculate costs: Engineering time, sales support, marketing resources → Try to build ROI model → Not confident in assumptions → Schedule calls with 3 people who\'ve done similar partnerships → Takes 5 days to get meetings → Finally compile recommendation. Total time: 10+ hours over 2 weeks.',
      aiVoiceWay: 'Tuesday morning, TechPartner reaches out. While grabbing coffee, you say: "AIVA, evaluate partnership opportunity with TechPartner Inc. Research their company, customer base, estimate revenue potential, assess integration requirements, and recommend partnership structure. Include ROI analysis." By Wednesday morning, AIVA provides: "TechPartner Inc partnership evaluation: Company: Series C SaaS company, $47M ARR, 5,200 customers, strong reputation in financial services sector. Customer overlap: 62% of their customers match your ICP (mid-market financial services companies). Estimated opportunity: 5,200 customers × 15% conversion rate (based on 8 similar partnerships) × $42K average deal size = $32.8M potential revenue over 3 years. Partnership structure recommendation: Technology integration partnership with revenue share. They earn 15% on deals they source, you handle sales and implementation. Integration requirements: 6 weeks engineering time (1 engineer), API documentation suggests straightforward integration. Costs: $85K engineering + $40K co-marketing + $60K sales support = $185K investment. ROI: 177:1 over 3 years. Risk assessment: Medium—dependent on their ability to activate their customer base. Comparable partnerships: Analyzed 4 similar partnerships—average 12% conversion rate, 18-month ramp to full productivity. Recommendation: PURSUE—high ROI, strategic fit, manageable integration effort. Draft partnership proposal and term sheet ready." You review, present to CEO Thursday morning. CEO: "This is excellent analysis. Let\'s move forward." Partnership discussions begin Friday.',
      didYouKnow: {
        show: true,
        insight: 'Companies that evaluate partnerships with comprehensive data analysis close 2.5x more successful partnerships than those relying on gut feel. But thorough partnership evaluation takes so long that most BizDev teams pursue too few opportunities—AI makes evaluation instant.'
      },
      valueAddedSuggestion: {
        hours: 3.05,
        activity: 'Strategic Partnership Relationship Management',
        description: 'Nurture existing partnerships, drive co-marketing initiatives, maximize partner-sourced revenue',
        expectedImpact: 'Increases partner-sourced revenue 100-200%, builds strategic ecosystem, creates competitive moat'
      },
      additionalImpactQuestions: []
    },
    {
      id: 2,
      title: 'Market Research & Competitive Landscape Mapping',
      category: 'top5',
      baselineHours: 4.0,
      aiEnabledHours: 0.50,
      frequency: 'per strategic initiative',
      occurrencesPerYear: 12,
      timeMultiplier: 8.0,
      annualHoursFreed: 42,
      payrollFreed: 42 * hourlyRate,
      scenario: 'Your company wants to expand into the healthcare vertical. Your CEO asks: "What\'s the market size? Who are the competitors? What would it take to win? Is this worth pursuing?" You need a comprehensive market analysis.',
      oldWay: 'Google "healthcare [your category] market size" → Find conflicting reports (one says $5B, another says $12B) → Not sure which is accurate → Purchase Gartner report for $2,500 → Read 87-page report → Manually summarize key findings → Research competitors: Who sells to healthcare? → Find 8 competitors → Check their websites → Read G2 reviews → Try to understand their pricing (not public) → Research healthcare regulations: HIPAA, compliance requirements → Google "selling to healthcare challenges" → Read 15 articles → Interview 2 contacts who work in healthcare (schedule calls, takes a week) → Compile findings into market analysis document → Build market sizing model in Excel → Present to executive team. Total time: 16+ hours over 2 weeks.',
      aiVoiceWay: 'Monday morning, CEO makes the request. While walking to a meeting, you say: "AIVA, analyze the healthcare market opportunity for our product. Include market size, growth rate, key competitors, regulatory requirements, buying behavior, and go-to-market recommendations." In 35 minutes, AIVA provides: "Healthcare market analysis: Market size: $8.4B (2024), growing 14% annually, projected $16.2B by 2029. Key segments: Hospitals (42% of market), medical device manufacturers (28%), pharmaceuticals (18%), health tech startups (12%). Competitors: 8 major players—CompetitorA (market leader, 23% share), CompetitorB (fast growing, strong in hospitals), CompetitorC (focused on pharma). Your differentiation opportunity: Competitors weak in integrations with EHR systems—you have existing Epic integration (used by 54% of hospitals). Regulatory requirements: HIPAA compliance mandatory, SOC 2 Type 2 required for enterprise deals, BAA agreements needed. Sales cycle: 6-9 months (longer than your current 3-4 months), average deal size $180K (vs your current $85K). Go-to-market recommendation: Target mid-size hospitals (250-500 beds) first—faster sales cycles, less complex procurement. Partner with EHR consultants to drive referrals. Estimated investment: $500K (2 healthcare-specialized sales reps + compliance certification + marketing). Revenue potential Year 1: $2.4M, Year 2: $8.7M, Year 3: $18.2M. ROI: 4.8:1 over 3 years. Recommendation: PURSUE—large market, clear differentiation, manageable entry requirements. Detailed go-to-market plan ready." You review, add context, present Tuesday. CEO: "This is exactly what I needed. Let\'s do it."',
      didYouKnow: {
        show: true,
        insight: 'Companies that thoroughly research new markets before entering have 3.2x higher success rates than those who rush in. But comprehensive market analysis takes so long that many companies either skip research or wait too long and miss the opportunity—AI makes thorough research instant.'
      },
      valueAddedSuggestion: {
        hours: 3.5,
        activity: 'Strategic Business Development & Deal Execution',
        description: 'Source high-value partnership opportunities, negotiate complex deals, build strategic relationships',
        expectedImpact: 'Closes 3-5 major partnerships annually worth $10M+ in combined value'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Deal Structuring & Term Sheet Negotiation Prep',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.40,
      frequency: 'per major deal',
      occurrencesPerYear: 15,
      timeMultiplier: 7.5,
      annualHoursFreed: 39,
      payrollFreed: 39 * hourlyRate,
      scenario: 'You\'re negotiating a strategic partnership with GlobalDistributor (they\'ll resell your product to their 2,000 customers). They want exclusive rights in the manufacturing vertical, 30% revenue share, and quarterly marketing fund contributions. You need to figure out: Is this a good deal? What are our negotiation leverage points? What terms should we counter with?',
      oldWay: 'Review their proposed term sheet → Try to understand implications of each term → "Exclusive rights in manufacturing"—how much of our business is that? → Pull revenue data → Manufacturing vertical is 18% of revenue ($4.2M annually) → Giving them exclusivity means we can\'t sell direct in that vertical → Calculate opportunity cost → "30% revenue share"—is that market standard? → Google "typical distribution partner revenue share" → Find ranges from 15% to 40% → Not sure what\'s appropriate for this type of partnership → Call 2 advisors to get input → Build financial model: If they close 100 deals/year at $45K average deal size = $4.5M revenue, they get $1.35M, we get $3.15M minus costs → Check with Finance: Can we support this margin structure? → Check with legal: What are risks of exclusivity clause? → Build counter-proposal term sheet → Review with CEO. Total time: 6+ hours.',
      aiVoiceWay: 'GlobalDistributor sends term sheet Tuesday afternoon. While on your commute home, you say: "AIVA, analyze the GlobalDistributor partnership term sheet. Assess the exclusivity clause, revenue share structure, marketing fund requirements. Compare to market standards, calculate financial impact, identify negotiation leverage points, and draft counter-proposal." By Wednesday morning, AIVA provides: "GlobalDistributor term sheet analysis: Exclusivity in manufacturing: Represents $4.2M (18%) of your revenue. RISK: Locks out direct sales in your second-largest vertical. Market standard: Exclusivity typically limited to specific sub-segments, not entire verticals. 30% revenue share: ABOVE market average (typical: 20-25% for non-exclusive, 25-30% for exclusive in narrow segment). Marketing fund contribution ($50K quarterly = $200K annually): STANDARD for partnerships of this size. Financial impact: Projected 120 deals/year × $48K average = $5.76M revenue. After 30% share = $4.03M to you. Margin analysis: Acceptable if they deliver >100 deals/year. Negotiation leverage: They need your product—you have strong brand in manufacturing, they have limited competing options. Recommended counter-terms: 1) Limit exclusivity to discrete manufacturing sub-segment (not all of manufacturing), 2) Tiered revenue share: 25% for first $3M, 20% after $3M (incentivizes higher volume), 3) Accept marketing fund, but require quarterly performance reviews. Expected outcome: They accept tiered revenue share + limited exclusivity. Counter-term sheet drafted and ready." You review, present to CEO, negotiate from position of strength. Deal closed with favorable terms.',
      didYouKnow: {
        show: true,
        insight: 'Partnership deals negotiated with financial modeling and market benchmarking data result in 35% better terms on average than deals negotiated on gut feel. But most BizDev teams don\'t have time for deep analysis during fast-moving negotiations—AI provides instant expert analysis.'
      },
      valueAddedSuggestion: {
        hours: 2.6,
        activity: 'Executive Relationship Building & Strategic Advisory',
        description: 'Build C-suite relationships with partners, provide strategic guidance, position as trusted advisor',
        expectedImpact: 'Unlocks enterprise-wide partnerships, drives strategic deals, builds long-term competitive advantage'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Channel Partner Enablement & Performance Management',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'quarterly per partner',
      occurrencesPerYear: 20,
      timeMultiplier: 8.3,
      annualHoursFreed: 44,
      payrollFreed: 44 * hourlyRate,
      scenario: 'You have 5 channel partners who are supposed to be reselling your product. Quarterly business review with your top partner (PartnerCo) is next week. Your VP asks: "How are they performing? Are they hitting targets? Should we invest more in this partnership or pivot resources elsewhere?" You need performance data and recommendations.',
      oldWay: 'Pull partner deal data from Salesforce → PartnerCo closed 8 deals last quarter → What was their target? → Search email for partnership agreement → Find contract from 18 months ago → Target was 12 deals per quarter → They\'re underperforming 33% → Why? → Check their pipeline → Only 15 opportunities (should be 40-50 for healthy pipeline) → Check deal sizes → Average $35K (vs expected $50K) → They\'re selling to smaller companies than planned → Check partner engagement: When did they last do training? → Search calendar → 6 months ago → Check co-marketing activities → None in 3 months → Compile all this data → Build recommendations: Should we double down or reduce investment? → Not sure → What do successful partners look like? → Pull data on other 4 partners → Build comparison → Finally determine: PartnerCo is underperforming, needs intervention or transition resources elsewhere → Build QBR deck. Total time: 2.5+ hours.',
      aiVoiceWay: 'Friday before QBR, you say: "AIVA, analyze PartnerCo performance vs targets. Compare to our other channel partners. Recommend: invest more, maintain, or reduce resources. Prepare QBR materials." In 20 minutes, AIVA provides: "PartnerCo performance analysis (Q3): Deals closed: 8 (vs 12 target, -33%). Revenue: $280K (vs $600K target, -53%). Pipeline: 15 opportunities worth $520K (should be $1.5M for healthy pipeline to hit Q4 target). Deal size: $35K average (selling to SMB vs target mid-market). Win rate: 42% (below our 58% benchmark). Time to close: 4.2 months (vs 3.1 month average). Engagement: Last training 6 months ago, no co-marketing in 3 months, partner portal logins down 60%. Root cause analysis: PartnerCo sales team hasn\'t been trained on new features (6 months behind), marketing support is minimal (we provide $10K fund but they haven\'t used it), their sales team is 40% new reps (turnover issue). Comparison to other partners: BestPartner closed 18 deals ($950K, 150% of target), GoodPartner closed 14 deals ($720K, 120% of target). PartnerCo ranks 4th of 5 partners. Recommendation: INVEST IN INTERVENTION—potential is there but needs support. Actions: 1) Deliver training on new features next month, 2) Co-create 3 case studies from their wins, 3) Joint marketing campaign using their $10K fund, 4) Quarterly check-ins instead of waiting. If no improvement by Q1, reallocate resources. QBR deck with performance data and action plan ready." You review, conduct QBR, partner commits to improvements.',
      didYouKnow: {
        show: true,
        insight: 'Channel partners that receive quarterly performance reviews with data-driven action plans perform 2.8x better than those managed with annual check-ins. But analyzing partner performance manually takes so long that most partner managers rely on gut feel—AI provides objective performance analysis.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic Partner Ecosystem Development',
        description: 'Recruit new tier-1 partners, build partner community, create partner innovation programs',
        expectedImpact: 'Grows partner-sourced revenue 150-250%, builds ecosystem competitive advantage'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Strategic Alliance & Joint Venture Structuring',
      category: 'top5',
      baselineHours: 4.0,
      aiEnabledHours: 0.50,
      frequency: 'per strategic deal',
      occurrencesPerYear: 6,
      timeMultiplier: 8.0,
      annualHoursFreed: 21,
      payrollFreed: 21 * hourlyRate,
      scenario: 'A major enterprise company (EnterpriseGiant, $5B revenue) wants to explore a strategic alliance: "We\'re interested in co-developing a solution for our industry vertical. Could be a joint venture, co-development partnership, or strategic investment. Let\'s explore options." Your CEO is very interested but asks: "What are the different structures we could pursue? What are pros and cons? What\'s our negotiation strategy?" You have 1 week to research and recommend.',
      oldWay: 'Research EnterpriseGiant → Read annual reports, press releases, LinkedIn → Research types of strategic alliances → Google "joint venture vs strategic partnership" → Read 12 articles → Talk to lawyer about legal structures → Lawyer bills 3 hours ($1,050) to explain options → Research comparable deals: What have similar companies done? → Search news for "joint venture in [industry]" → Find 8 examples → Try to understand terms (most details are private) → Build pros/cons for each structure: Joint venture (pro: aligned incentives, con: complex governance), Strategic partnership (pro: faster to set up, con: less commitment), Investment (pro: capital, con: dilution) → Try to model financials for each → Lots of assumptions → Build recommendation framework → Present to CEO → CEO asks tough questions you can\'t answer → Go back and research more. Total time: 12+ hours over a week.',
      aiVoiceWay: 'Tuesday after Enterprise Giant reaches out, you say: "AIVA, analyze strategic alliance options with EnterpriseGiant for co-development in their industry vertical. Research their company, evaluate JV vs partnership vs investment structures, model financial scenarios, and recommend strategy." By Thursday, AIVA provides: "EnterpriseGiant strategic alliance analysis: Company: $5.2B revenue, 12,000 customers in financial services, strong market position. Strategic fit: Their customer base aligns with our expansion strategy (450 target accounts overlap). Alliance structure options: 1) Joint Venture: Create new entity, 50/50 ownership, develop vertical-specific solution. Investment req: $2M each. Timeline: 12-18 months to market. Revenue potential: $15M annually by Year 3. Pros: Full commitment, shared investment. Cons: Complex governance, slower to launch. 2) Co-development Partnership: Collaborate on product, revenue share model. Investment: $500K development cost (split), 6-month timeline. Revenue potential: $8M annually via their channel. Pros: Faster, less complex. Cons: Less strategic lock-in. 3) Strategic Investment: They invest $5M for 8% equity + distribution rights. Pros: Capital for growth, committed partner. Cons: Dilution, board seat. Comparable deals: Analyzed 14 similar alliances—co-development partnerships most common and successful for companies our stage. Recommendation: START with co-development partnership, option to convert to JV if successful. Financial model: 6-month co-development ($250K each), launch to their 12,000 customers, 5% conversion = 600 deals × $45K = $27M over 3 years (50/50 split). ROI: 54:1. Term sheet draft, negotiation strategy, and exec summary ready." You review, present to CEO Friday. CEO: "Let\'s pursue co-development partnership."',
      didYouKnow: {
        show: true,
        insight: 'Strategic alliances evaluated with comprehensive analysis close 3.4x more successfully than those pursued on executive gut feel alone. But thorough alliance evaluation takes so long that many companies rush into bad deals—AI enables proper due diligence in hours instead of weeks.'
      },
      valueAddedSuggestion: {
        hours: 3.5,
        activity: 'Executive Relationship & Strategic Deal Execution',
        description: 'Build C-level relationships with potential partners, negotiate complex terms, close transformational deals',
        expectedImpact: 'Closes 2-3 strategic deals annually that create 10x value through market access and brand elevation'
      },
      additionalImpactQuestions: []
    }
  ],

  'Executive Assistant': (hourlyRate) => [
    {
      id: 1,
      title: 'Calendar Optimization & Meeting Preparation',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.30,
      frequency: 'daily',
      occurrencesPerYear: 250,
      timeMultiplier: 8.3,
      annualHoursFreed: 550,
      payrollFreed: 550 * hourlyRate,
      scenario: 'It\'s 8:00 AM Monday. Your CEO has 14 meetings scheduled this week, 23 pending meeting requests, 3 scheduling conflicts, and just told you: "I need 2 hours of focus time Wed afternoon for board deck prep, and I want to meet the finalist candidates for VP Sales this week." You need to optimize the calendar and prepare briefing materials for each meeting.',
      oldWay: 'Review all 23 meeting requests → Prioritize: Which are urgent? Which can be delegated? Which can be 15 minutes instead of 30? → Check CEO\'s calendar → Find 3 scheduling conflicts → Email all parties to reschedule → Wait for responses → Spend 30 minutes playing calendar Tetris → Block 2 hours Wednesday afternoon → Try to squeeze in VP Sales candidate interviews → Realize Thursday is already packed → Move 2 existing meetings → Now prepare meeting briefs for 14 meetings: Research attendees on LinkedIn → Review past email threads for context → Check if there\'s a pre-read document → Summarize key points CEO needs to know → Build 14 separate briefing docs → Email CEO the briefings. Done by 11:30 AM (half your day gone on calendar management).',
      aiVoiceWay: 'Monday at 8:00 AM, while your CEO is in their first meeting, you say: "AIVA, optimize this week\'s calendar. Handle scheduling conflicts, block 2 hours Wednesday afternoon for focus time, schedule finalist VP Sales interviews, and prepare meeting briefs for all 14 meetings." In 20 minutes, AIVA responds: "Calendar optimized: Resolved 3 conflicts (meetings rescheduled with automated emails sent). Wednesday 2-4 PM blocked for board deck prep. VP Sales finalist interviews scheduled: Thursday 10-11 AM (Candidate A), Friday 3-4 PM (Candidate B). Meeting brief summaries ready for 14 meetings including: 9:00 AM—Budget review with CFO (context: Q4 forecast is $420K over budget, CFO will likely propose cuts. Talking points: Strategic hires are non-negotiable, can defer 2 marketing initiatives). 11:00 AM—Product roadmap review (Product team will present Q2 priorities, decision needed on healthcare expansion timeline). 2:00 PM—Customer escalation with TechCorp (account at risk, $450K ARR, need resolution plan). All briefing docs include: attendees, agenda, background context, key decisions needed, suggested talking points. Should I send daily calendar summary to CEO each morning?" You say "Yes." CEO receives organized calendar and briefings by 8:30 AM. CEO response: "This is perfect, thank you."',
      didYouKnow: {
        show: true,
        insight: 'Executives who start their day with organized calendars and meeting briefs are 3x more productive than those who go into meetings cold. Executive assistants who can deliver this in 20 minutes instead of 3.5 hours free up their time to handle strategic projects that make their executives even more effective.'
      },
      valueAddedSuggestion: {
        hours: 2.2,
        activity: 'Strategic Project Coordination & Executive Support',
        description: 'Coordinate cross-functional projects, manage strategic initiatives, provide high-level executive support',
        expectedImpact: 'Accelerates executive productivity 30-50%, enables CEO to focus on highest-value activities'
      },
      additionalImpactQuestions: []
    },
    {
      id: 2,
      title: 'Travel Coordination with Multi-Variable Constraints',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.25,
      frequency: 'per trip',
      occurrencesPerYear: 40,
      timeMultiplier: 8.0,
      annualHoursFreed: 70,
      payrollFreed: 70 * hourlyRate,
      scenario: 'Your CEO needs to attend a conference in New York next Tuesday-Wednesday, then visit a customer in Boston Thursday morning, and be back home Thursday evening for their kid\'s soccer game at 6 PM. They want: direct flights, no middle seats, hotel within walking distance of conference venue, and access to gym. Oh, and the company travel policy requires approval for business class on flights over 5 hours.',
      oldWay: 'Open flight booking site → Search San Francisco to New York Tuesday morning → Find 8 options → Filter by direct flights only → Compare departure times → CEO prefers to leave after 9 AM → Find 3 options → Check seat maps (avoid middle seats) → Price differences: $450 to $890 → Book the 10:15 AM flight → Now book New York to Boston Wednesday evening → Find options → CEO needs to arrive by 9 AM Thursday for customer meeting → Book 7:00 PM flight Wed → Now book Boston to SF Thursday → Customer meeting ends at noon, need to be home by 6 PM → Flight takes 6 hours → Book 1:30 PM flight (lands at 4:45 PM local, gets home by 5:45 PM—cutting it close) → Now book hotels → Search hotels near conference venue → Filter by hotels with gyms → Read 23 reviews → Find 3 options → Compare prices → Book Marriott ($340/night) → Now deal with approvals: CEO wants business class → Flight is 6 hours → Requires VP approval per policy → Email VP for approval → Wait 4 hours → Approved → Rebook flights → Compile itinerary → Email CEO. Total time: 2+ hours.',
      aiVoiceWay: 'Monday afternoon, CEO mentions the trip. You say: "AIVA, plan trip to NYC conference Tuesday-Wednesday, Boston customer visit Thursday morning, home by 6 PM Thursday for kid\'s soccer game. Requirements: direct flights, aisle or window seats only, hotel near conference with gym. Handle travel policy approvals." In 15 minutes, AIVA provides: "Travel itinerary for NY + Boston trip: Tuesday: SFO→JFK direct, depart 10:30 AM, arrive 7:15 PM, United 1245, seat 4A (aisle, business class—flight 6hrs 45min, requires VP approval—auto-requested). Hotel: Marriott Marquis (0.2 miles from conference, gym on 4th floor, $329/night with corporate rate). Wednesday: JFK→BOS, depart 7:45 PM, arrive 9:15 PM, JetBlue 517, seat 12F (window, economy), hotel near customer office. Thursday: Customer meeting 9-11:30 AM, lunch 11:30-12:30, BOS→SFO depart 2:00 PM, arrive 5:20 PM (lands 5:20, home by 5:50 with traffic buffer—makes 6 PM soccer game). VP travel approval received (auto-requested via email). Total trip cost: $2,847. Calendar blocks added, car service booked for airport transfers, customer meeting confirmed. Full itinerary PDF ready." You review (5 minutes), confirm with CEO. Trip booked in 20 minutes.',
      didYouKnow: {
        show: true,
        insight: 'Complex multi-city travel with constraints typically takes 2-3 hours to coordinate manually. Executive assistants who can deliver optimized itineraries in 15 minutes free up 75+ hours annually—time that can be used for strategic executive support instead of logistics.'
      },
      valueAddedSuggestion: {
        hours: 1.75,
        activity: 'Relationship Management & Stakeholder Communication',
        description: 'Manage executive relationships, handle sensitive communications, coordinate with board and investors',
        expectedImpact: 'Strengthens executive relationships, improves stakeholder satisfaction, protects executive time'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Information Synthesis & Briefing Document Creation',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.35,
      frequency: 'per major meeting/decision',
      occurrencesPerYear: 60,
      timeMultiplier: 7.1,
      annualHoursFreed: 129,
      payrollFreed: 129 * hourlyRate,
      scenario: 'Your CEO has an important board meeting Friday. They say: "I need a briefing doc on our Q4 performance. Pull together: revenue vs plan, sales pipeline, product launches, hiring progress, and any major risks or issues. I want the full story in 3 pages so I can prep Thursday night." It\'s Wednesday afternoon.',
      oldWay: 'Email CFO: "Need Q4 revenue numbers" → Wait for response → Email VP Sales: "Need pipeline update" → Email CTO: "Need product launch status" → Email COO: "Need hiring progress" → Wait for 4 responses → Only 2 respond → Chase down the other 2 → Finally receive all data by Thursday morning → Data is in different formats (one Excel, one PDF, one in Slack message) → Manually compile into Word doc → Realize revenue data doesn\'t match what sales pipeline suggests → Ask CFO for clarification → Build summary → Realize you don\'t know what "major risks" are → Ask CEO: "What risks should I include?" → CEO says "You know, the usual stuff" (not helpful) → Make educated guesses → Format document → CEO reviews, says "Can you add context on why Product Launch B was delayed?" → Don\'t know the answer → Ask CTO → Add context → Final doc done Thursday at 7:45 PM.',
      aiVoiceWay: 'Wednesday afternoon, CEO makes the request. You say: "AIVA, create board meeting briefing doc for Q4 performance. Include revenue vs plan, sales pipeline, product launches, hiring progress, and major risks. Keep it to 3 pages, executive-level detail." In 25 minutes, AIVA provides: "Q4 board briefing prepared (3 pages): Executive Summary: Strong quarter—revenue $12.4M vs $11.8M plan (5% ahead), pipeline healthy at $48M (2.1x coverage), 2 major product launches completed, hiring 89% to plan (missed 2 engineering roles). Financial Performance: Revenue breakdown by segment, gross margin improved 3 points to 72%, CAC payback period improved from 18 to 14 months. Sales Pipeline: $48M pipeline, weighted forecast $14.2M for Q1, top 10 deals highlighted. Product Launches: Launch A (Analytics Dashboard) completed on time, customer adoption 40% in first month. Launch B (Mobile App) delayed 3 weeks due to iOS certification—now live, early feedback positive. Hiring: 27 hires completed (target was 31), 2 engineering roles open 90+ days (competitive market), plan to fill in Q1. Major Risks: 1) Customer churn ticked up 0.8 points (due to 2 enterprise customer losses), mitigation plan in place. 2) Competitive pressure from new entrant in mid-market segment. 3) AWS costs growing faster than revenue (+23% vs +18%)—optimization project underway. Appendix includes detailed metrics. Briefing doc formatted and ready." You review (20 minutes), send to CEO Wednesday evening. CEO response: "This is perfect—exactly what I needed."',
      didYouKnow: {
        show: true,
        insight: 'Executives who go into board meetings with comprehensive briefings are 4x more likely to have productive discussions and get board approval for strategic initiatives. Executive assistants who can synthesize information from across the company in 30 minutes instead of 8+ hours become invaluable strategic partners.'
      },
      valueAddedSuggestion: {
        hours: 2.15,
        activity: 'Executive Decision Support & Strategic Research',
        description: 'Conduct research for strategic decisions, analyze options, provide decision frameworks',
        expectedImpact: 'Accelerates executive decision-making 40-60%, improves decision quality'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Expense Report Processing & Budget Tracking',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.15,
      frequency: 'weekly',
      occurrencesPerYear: 50,
      timeMultiplier: 10.0,
      annualHoursFreed: 67.5,
      payrollFreed: 67.5 * hourlyRate,
      scenario: 'Every Friday you process your CEO\'s expense reports: Receipts from 12 business dinners, 3 flights, 2 hotels, 1 rental car, conference registration, and various Uber/Lyft rides. Total: 47 receipts to categorize, many are crumpled photos from their phone. Your finance team needs this by EOD Friday for month-end close.',
      oldWay: 'Open expense folder (CEO forwarded receipts via email throughout the week) → Download 47 attachments → Many photos are sideways or blurry → Manually enter each expense in Concur → Receipt 1: Dinner $287—is this client entertainment or team dinner? → Search email for context → Find it was client dinner with TechCorp → Categorize correctly → Add business purpose → Upload receipt → Next expense → Flight receipt has confirmation number but no price → Log into United to find actual cost → Enter expense → Hotel receipt is in euros → Google exchange rate → Calculate USD amount → Continue for 47 expenses → Realize 8 receipts are missing → Text CEO: "I need receipts for these 8 items" → CEO responds 2 hours later with photos → Some photos don\'t match dates → Ask for clarification → Finally submit expense report at 5:47 PM (finance already closed their books, you get scolded).',
      aiVoiceWay: 'Friday morning, you say: "AIVA, process this week\'s expense receipts for CEO. 47 receipts in email, categorize correctly, flag any missing info, calculate totals, and submit to Concur by 3 PM." In 10 minutes, AIVA provides: "Expense report processed: 47 receipts analyzed. Categorized: 12 client entertainment meals ($2,847 total), 3 flights ($1,680), 2 hotels ($890), 1 rental car ($247), 1 conference registration ($1,200), 28 ground transportation ($547). Total expenses: $7,411. Currency conversions applied (hotel receipt in EUR converted at 1.08 rate). Business purpose auto-populated from calendar context: Client dinner Oct 22 was with TechCorp CFO (calendar entry). Missing info: 3 receipts need business purpose clarification (flagged for CEO), 1 receipt image unclear (requested replacement). Policy compliance: All expenses within policy limits. Report ready for CEO review and submission." CEO reviews on phone (5 minutes), answers 3 questions, approves. You submit to Concur at 10:30 AM. Finance: happy.',
      didYouKnow: {
        show: true,
        insight: 'Executive expense processing that takes 90 minutes weekly equals 75 hours annually—nearly 2 full work weeks. By automating expense processing to 10 minutes, executive assistants free up time for higher-value strategic support that actually advances their executive\'s priorities.'
      },
      valueAddedSuggestion: {
        hours: 1.35,
        activity: 'Executive Priority Management & Strategic Gatekeeping',
        description: 'Protect executive time, filter low-value requests, ensure focus on highest-impact activities',
        expectedImpact: 'Increases executive productivity 30-50%, improves work-life balance, protects strategic thinking time'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Meeting Notes & Action Item Tracking',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.20,
      frequency: 'per exec meeting',
      occurrencesPerYear: 100,
      timeMultiplier: 10.0,
      annualHoursFreed: 180,
      payrollFreed: 180 * hourlyRate,
      scenario: 'Your CEO just finished a 2-hour executive team meeting (CFO, CTO, COO, VP Sales, VP Product in attendance). They turn to you: "Can you send meeting notes and action items to everyone by end of day? I want to make sure we\'re all aligned on the 12 decisions we made." You were taking notes but may have missed some details.',
      oldWay: 'Review your handwritten notes → Try to remember everything that was discussed → Realize you missed 3 decisions while you were handling an urgent email → Listen to Zoom recording → Fast forward through 2 hours to find the parts you missed → Take additional notes → Organize notes by topic → Identify action items → Try to remember who was assigned each action → Some assignments weren\'t explicit → Make educated guesses → Type up formal meeting notes → Format as: Decisions made, Action items (owner, due date), Next steps → Realize you forgot to capture the budget number the CFO mentioned → Re-watch that section of recording → Update notes → Email draft to CEO for review → CEO responds 2 hours later: "You missed the decision about the healthcare expansion timeline" → Watch recording again → Find it → Update notes → Finally send to exec team at 6:42 PM. Total time: 2 hours.',
      aiVoiceWay: 'Meeting ends at 11 AM. You say: "AIVA, generate meeting notes from today\'s exec team meeting. Include decisions made, action items with owners and due dates, and key discussion points." In 12 minutes, AIVA provides: "Executive team meeting notes (Oct 28, 9-11 AM): Attendees: CEO, CFO, CTO, COO, VP Sales, VP Product. Key decisions: 1) Approve $500K budget for healthcare expansion (CFO confirmed funding available, starts Q1). 2) Delay mobile app v2 launch from Nov to Dec (CTO needs 3 more weeks for iOS certification). 3) Hire 2 additional enterprise AEs in Q4 (VP Sales, recruiting to start next week). 4) Implement new pricing tier for mid-market (VP Product, launch with analytics feature). 5) Increase marketing budget 15% for Q4 ($45K additional, CMO to allocate). 6-12: Additional decisions documented. Action items: CFO—finalize healthcare expansion budget allocation by Nov 5. CTO—provide revised mobile app launch timeline by Nov 1. VP Sales—submit job descriptions for 2 AE roles by Oct 31. VP Product—schedule pricing strategy session by Nov 3. COO—review Q4 hiring plan and capacity (Nov 2). Total: 18 action items assigned. Next meeting: Nov 4, 9 AM. Meeting notes formatted and ready to send." You review (5 minutes), send to team at 11:18 AM. CEO response: "Perfect, thanks!"',
      didYouKnow: {
        show: true,
        insight: 'Executive meetings where notes and action items are distributed within 1 hour see 3.7x higher action completion rates than meetings where notes arrive days later. Fast follow-through drives execution velocity—AI makes same-day meeting notes effortless.'
      },
      valueAddedSuggestion: {
        hours: 1.8,
        activity: 'Strategic Executive Communication & Speechwriting',
        description: 'Draft executive communications, write board presentations, craft strategic messaging',
        expectedImpact: 'Elevates executive presence, drives organizational alignment, positions for Chief of Staff role'
      },
      additionalImpactQuestions: []
    }
  ]
};

// Helper function to get deliverables for a specific role
export const getDeliverablesForRole = (jobTitle, hourlyRate) => {
  if (ROLE_DELIVERABLES[jobTitle]) {
    return ROLE_DELIVERABLES[jobTitle](hourlyRate);
  }

  // Default fallback for unmapped roles - 5 generic deliverables
  console.log(`⚠️  No predefined deliverables for role: "${jobTitle}". Using generic fallback.`);
  return [
    {
      id: 1,
      title: 'Information Gathering & Research',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.3,
      frequency: 'daily',
      occurrencesPerYear: 220,
      timeMultiplier: 8.3,
      annualHoursFreed: 484,
      payrollFreed: 484 * hourlyRate,
      scenario: 'You need to gather information, research best practices, or find specific data to make informed decisions',
      oldWay: 'Search multiple sources, read through documentation, cross-reference information, take notes, and synthesize findings manually',
      aiVoiceWay: 'Ask AIVA to research and synthesize information instantly, providing you with actionable insights while you focus on decision-making',
      didYouKnow: {
        show: true,
        insight: 'Research tasks typically consume 20-30% of knowledge workers\' time. AI voice assistance can reduce this to under 5%.'
      },
      valueAddedSuggestion: {
        hours: 484,
        activity: 'Strategic Analysis & Planning',
        description: 'Apply insights to high-value strategic initiatives',
        expectedImpact: 'Faster decision-making and more informed strategic direction'
      },
      additionalImpactQuestions: []
    },
    {
      id: 2,
      title: 'Report & Documentation Creation',
      category: 'top5',
      baselineHours: 3.0,
      aiEnabledHours: 0.5,
      frequency: 'weekly',
      occurrencesPerYear: 48,
      timeMultiplier: 6.0,
      annualHoursFreed: 120,
      payrollFreed: 120 * hourlyRate,
      scenario: 'You need to create reports, write documentation, or prepare presentations for stakeholders',
      oldWay: 'Manually compile data, format documents, write content, revise drafts, and ensure consistency across materials',
      aiVoiceWay: 'Describe your report requirements to AIVA, which drafts structured content while you focus on reviewing and refining key points',
      didYouKnow: {
        show: true,
        insight: 'Documentation creation is often delayed because it\'s time-consuming. AI acceleration means documentation stays current and comprehensive.'
      },
      valueAddedSuggestion: {
        hours: 120,
        activity: 'Stakeholder Communication & Relationship Building',
        description: 'Invest freed time in deeper stakeholder engagement',
        expectedImpact: 'Stronger relationships and better organizational alignment'
      },
      additionalImpactQuestions: []
    },
    {
      id: 3,
      title: 'Process Coordination & Task Management',
      category: 'top5',
      baselineHours: 2.0,
      aiEnabledHours: 0.4,
      frequency: 'daily',
      occurrencesPerYear: 200,
      timeMultiplier: 5.0,
      annualHoursFreed: 320,
      payrollFreed: 320 * hourlyRate,
      scenario: 'You need to coordinate processes, manage tasks, track progress, and ensure team alignment',
      oldWay: 'Manually check statuses, send follow-up emails, update spreadsheets, schedule meetings, and chase down information',
      aiVoiceWay: 'AIVA helps you quickly assess status, draft communications, and identify bottlenecks through conversational queries',
      didYouKnow: {
        show: true,
        insight: 'Process coordination overhead grows exponentially with team size. AI assistance scales linearly, preventing coordination bottlenecks.'
      },
      valueAddedSuggestion: {
        hours: 320,
        activity: 'Process Improvement & Optimization',
        description: 'Use freed time to improve systems and workflows',
        expectedImpact: 'Compound efficiency gains and team effectiveness improvements'
      },
      additionalImpactQuestions: []
    },
    {
      id: 4,
      title: 'Problem-Solving & Troubleshooting',
      category: 'top5',
      baselineHours: 2.5,
      aiEnabledHours: 0.5,
      frequency: 'per issue',
      occurrencesPerYear: 80,
      timeMultiplier: 5.0,
      annualHoursFreed: 160,
      payrollFreed: 160 * hourlyRate,
      scenario: 'Issues arise that require investigation, root cause analysis, and solution development',
      oldWay: 'Manually investigate symptoms, research possible causes, test hypotheses, consult documentation, and develop solutions through trial and error',
      aiVoiceWay: 'Describe the problem to AIVA, which helps you rapidly diagnose issues, suggests solutions based on best practices, and guides troubleshooting',
      didYouKnow: {
        show: true,
        insight: 'Faster problem resolution prevents cascading delays. Hours saved on troubleshooting multiply through avoided downstream impacts.'
      },
      valueAddedSuggestion: {
        hours: 160,
        activity: 'Preventative Analysis & Risk Mitigation',
        description: 'Proactively identify and prevent future issues',
        expectedImpact: 'Reduced firefighting and more predictable operations'
      },
      additionalImpactQuestions: []
    },
    {
      id: 5,
      title: 'Communication & Meeting Preparation',
      category: 'top5',
      baselineHours: 1.5,
      aiEnabledHours: 0.3,
      frequency: 'daily',
      occurrencesPerYear: 220,
      timeMultiplier: 5.0,
      annualHoursFreed: 264,
      payrollFreed: 264 * hourlyRate,
      scenario: 'You need to prepare for meetings, draft communications, or respond to inquiries from colleagues and stakeholders',
      oldWay: 'Manually review context, draft emails, prepare talking points, gather supporting materials, and ensure messaging is clear and accurate',
      aiVoiceWay: 'Brief AIVA on your communication needs, and it helps you draft clear, well-structured content while you focus on strategy and relationships',
      didYouKnow: {
        show: true,
        insight: 'Professionals spend 28% of their workweek on email. AI assistance reduces composition time by 70% while improving clarity.'
      },
      valueAddedSuggestion: {
        hours: 264,
        activity: 'Relationship Building & Strategic Conversations',
        description: 'Invest in deeper, more meaningful professional interactions',
        expectedImpact: 'Stronger network, better collaboration, and increased influence'
      },
      additionalImpactQuestions: []
    }
  ];
};
