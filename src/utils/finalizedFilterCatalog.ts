import { FilterCategory, FilterSection, FilterItem } from './filterCatalog';

/**
 * FINALIZED FILTER CATALOG - Based on comprehensive CSV data analysis
 * This is the definitive filter catalog that matches actual data sources
 * 
 * Key Data Sources Found:
 * - voters_gender: 6 records (M/F)
 * - voters_age: 243 records (18-100 age buckets)
 * - ethnic_description: 172 records (diverse ethnicities)
 * - commercialdata_estimatedhhincome: 32 records (income brackets)
 * - consumerdata_auto_make_1: 114 records (car makes)
 * - consumerdata_auto_make_2: 101 records (secondary car makes)
 * - voters_movedfrom_state: 123 records (migration states)
 * - hs_* taxonomies: 400+ records each (political views/attitudes)
 */

export const FINALIZED_FILTER_CATALOG: FilterCategory[] = [
  // 1. AREA SELECTION (Always first)
  {
    id: 'area-selection',
    title: 'Area Selection',
    icon: '🗺️',
    description: 'Geographic area selection for analysis',
    sections: [{
      title: 'States',
      description: 'Select states to analyze',
      searchable: true,
      collapsible: true,
      items: [
        {
          id: 'state-CA',
          label: 'California (CA)',
          description: 'California state - 39.5M population',
          category: 'Geographic Areas',
          taxonomy: 'state',
          count: 0,
          states: ['CA']
        },
        {
          id: 'state-NY',
          label: 'New York (NY)',
          description: 'New York state - 20.2M population',
          category: 'Geographic Areas',
          taxonomy: 'state',
          count: 0,
          states: ['NY']
        },
        {
          id: 'state-WY',
          label: 'Wyoming (WY)',
          description: 'Wyoming state - 576K population',
          category: 'Geographic Areas',
          taxonomy: 'state',
          count: 0,
          states: ['WY']
        }
      ]
    }]
  },

  // 2. CORE DEMOGRAPHICS
  {
    id: 'core-demographics',
    title: 'Core Demographics',
    icon: '👥',
    description: 'Basic demographic information',
    sections: [
      {
        title: 'Gender',
        description: 'Voter gender distribution (6 records)',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'voters_gender_male',
            label: 'Male Voters',
            description: 'Male voter segments (M)',
            category: 'Demographics',
            taxonomy: 'voters_gender',
            count: 0,
            states: []
          },
          {
            id: 'voters_gender_female',
            label: 'Female Voters',
            description: 'Female voter segments (F)',
            category: 'Demographics',
            taxonomy: 'voters_gender',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Age Groups',
        description: 'Voter age distribution (243 records, ages 18-100)',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'voters_age_18_34',
            label: 'Ages 18-34',
            description: 'Young adult voters (18-34)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          },
          {
            id: 'voters_age_35_54',
            label: 'Ages 35-54',
            description: 'Middle-aged voters (35-54)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          },
          {
            id: 'voters_age_55_74',
            label: 'Ages 55-74',
            description: 'Mature voters (55-74)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          },
          {
            id: 'voters_age_75_plus',
            label: 'Ages 75+',
            description: 'Senior voters (75+)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Ethnicity',
        description: 'Ethnic and racial demographics (172 records)',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'ethnic_description_african_american',
            label: 'African American',
            description: 'African American voters',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          },
          {
            id: 'ethnic_description_hispanic',
            label: 'Hispanic',
            description: 'Hispanic voters',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          },
          {
            id: 'ethnic_description_white',
            label: 'White',
            description: 'White voters',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          },
          {
            id: 'ethnic_description_asian',
            label: 'Asian',
            description: 'Asian voters',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },

  // 3. HOUSEHOLD & INCOME
  {
    id: 'household-income',
    title: 'Household & Income',
    icon: '🏠',
    description: 'Household composition and income brackets',
    sections: [
      {
        title: 'Income Brackets',
        description: 'Household income distribution (32 records)',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'commercialdata_estimatedhhincome_under_25k',
            label: 'Under $25,000',
            description: 'Households earning under $25,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincome_25k_50k',
            label: '$25,000 - $50,000',
            description: 'Households earning $25,000 - $50,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincome_50k_75k',
            label: '$50,000 - $75,000',
            description: 'Households earning $50,000 - $75,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincome_75k_100k',
            label: '$75,000 - $100,000',
            description: 'Households earning $75,000 - $100,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincome_over_100k',
            label: 'Over $100,000',
            description: 'Households earning over $100,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },

  // 4. CONSUMER DATA
  {
    id: 'consumer-data',
    title: 'Consumer Data',
    icon: '🚗',
    description: 'Consumer behavior and purchasing patterns',
    sections: [
      {
        title: 'Automotive',
        description: 'Car ownership and preferences (114 primary, 101 secondary)',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'consumerdata_auto_make_ford',
            label: 'Ford Owners',
            description: 'Ford vehicle owners',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_toyota',
            label: 'Toyota Owners',
            description: 'Toyota vehicle owners',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_honda',
            label: 'Honda Owners',
            description: 'Honda vehicle owners',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_chevrolet',
            label: 'Chevrolet Owners',
            description: 'Chevrolet vehicle owners',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_nissan',
            label: 'Nissan Owners',
            description: 'Nissan vehicle owners',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },

  // 5. POLITICAL VIEWS & ATTITUDES (Top hs_* taxonomies)
  {
    id: 'political-views',
    title: 'Political Views & Attitudes',
    icon: '🗳️',
    description: 'Political opinions, attitudes, and ideological positions (390+ filters)',
    sections: [
      {
        title: 'Elections & Candidates',
        description: '2024 election preferences and candidate views',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_trump_vs_harris_favor_harris_supporter',
            label: 'Harris vs Trump (Favor Harris)',
            description: 'Favors Harris in Trump vs Harris matchup (segment >65)',
            category: 'Elections',
            taxonomy: 'hs_trump_vs_harris_favor_harris',
            count: 0,
            states: []
          },
          {
            id: 'hs_trump_vs_harris_favor_harris_opposer',
            label: 'Harris vs Trump (Oppose Harris)',
            description: 'Opposes Harris in Trump vs Harris matchup (segment ≤65)',
            category: 'Elections',
            taxonomy: 'hs_trump_vs_harris_favor_harris',
            count: 0,
            states: []
          },
          {
            id: 'hs_biden_approval_supporter',
            label: 'Biden Approval (Supporter)',
            description: 'Approves of Biden (segment >65)',
            category: 'Elections',
            taxonomy: 'hs_biden_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_biden_approval_opposer',
            label: 'Biden Approval (Opposer)',
            description: 'Disapproves of Biden (segment ≤65)',
            category: 'Elections',
            taxonomy: 'hs_biden_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_trump_approval_supporter',
            label: 'Trump Approval (Supporter)',
            description: 'Approves of Trump (segment >65)',
            category: 'Elections',
            taxonomy: 'hs_trump_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_trump_approval_opposer',
            label: 'Trump Approval (Opposer)',
            description: 'Disapproves of Trump (segment ≤65)',
            category: 'Elections',
            taxonomy: 'hs_trump_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_harris_approval_supporter',
            label: 'Harris Approval (Supporter)',
            description: 'Approves of Harris (segment >65)',
            category: 'Elections',
            taxonomy: 'hs_harris_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_harris_approval_opposer',
            label: 'Harris Approval (Opposer)',
            description: 'Disapproves of Harris (segment ≤65)',
            category: 'Elections',
            taxonomy: 'hs_harris_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_newsom_approval_supporter',
            label: 'Newsom Approval (Supporter)',
            description: 'Approves of Newsom (segment >65)',
            category: 'Elections',
            taxonomy: 'hs_newsom_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_newsom_approval_opposer',
            label: 'Newsom Approval (Opposer)',
            description: 'Disapproves of Newsom (segment ≤65)',
            category: 'Elections',
            taxonomy: 'hs_newsom_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_bernie_approval_supporter',
            label: 'Bernie Sanders Approval (Supporter)',
            description: 'Approves of Bernie Sanders (segment >65)',
            category: 'Elections',
            taxonomy: 'hs_bernie_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_bernie_approval_opposer',
            label: 'Bernie Sanders Approval (Opposer)',
            description: 'Disapproves of Bernie Sanders (segment ≤65)',
            category: 'Elections',
            taxonomy: 'hs_bernie_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_aoc_approval_supporter',
            label: 'AOC Approval (Supporter)',
            description: 'Approves of Alexandria Ocasio-Cortez (segment >65)',
            category: 'Elections',
            taxonomy: 'hs_aoc_approval',
            count: 0,
            states: []
          },
          {
            id: 'hs_aoc_approval_opposer',
            label: 'AOC Approval (Opposer)',
            description: 'Disapproves of Alexandria Ocasio-Cortez (segment ≤65)',
            category: 'Elections',
            taxonomy: 'hs_aoc_approval',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Party Affiliation',
        description: 'Political party identification and loyalty',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_tribalism_team_dem_supporter',
            label: 'Team Democrat (Supporter)',
            description: 'Strongly identifies with Democratic party (segment >65)',
            category: 'Party Affiliation',
            taxonomy: 'hs_tribalism_team_dem',
            count: 0,
            states: []
          },
          {
            id: 'hs_tribalism_team_dem_opposer',
            label: 'Team Democrat (Opposer)',
            description: 'Does not identify with Democratic party (segment ≤65)',
            category: 'Party Affiliation',
            taxonomy: 'hs_tribalism_team_dem',
            count: 0,
            states: []
          },
          {
            id: 'hs_tribalism_team_gop_supporter',
            label: 'Team GOP (Supporter)',
            description: 'Strongly identifies with Republican party (segment >65)',
            category: 'Party Affiliation',
            taxonomy: 'hs_tribalism_team_gop',
            count: 0,
            states: []
          },
          {
            id: 'hs_tribalism_team_gop_opposer',
            label: 'Team GOP (Opposer)',
            description: 'Does not identify with Republican party (segment ≤65)',
            category: 'Party Affiliation',
            taxonomy: 'hs_tribalism_team_gop',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Social Issues',
        description: 'Views on social and cultural issues',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_gun_control_support_supporter',
            label: 'Gun Control Support (Supporter)',
            description: 'Supports stricter gun control (segment >65)',
            category: 'Social Issues',
            taxonomy: 'hs_gun_control_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_gun_control_support_opposer',
            label: 'Gun Control Support (Opposer)',
            description: 'Opposes stricter gun control (segment ≤65)',
            category: 'Social Issues',
            taxonomy: 'hs_gun_control_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_same_sex_marriage_support_supporter',
            label: 'Same-Sex Marriage Support (Supporter)',
            description: 'Supports same-sex marriage (segment >65)',
            category: 'Social Issues',
            taxonomy: 'hs_same_sex_marriage_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_same_sex_marriage_support_opposer',
            label: 'Same-Sex Marriage Support (Opposer)',
            description: 'Opposes same-sex marriage (segment ≤65)',
            category: 'Social Issues',
            taxonomy: 'hs_same_sex_marriage_support',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Economic Issues',
        description: 'Views on economic and fiscal policies',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_ideology_fiscal_conserv_supporter',
            label: 'Fiscal Conservative (Supporter)',
            description: 'Identifies as fiscally conservative (segment >65)',
            category: 'Economic Issues',
            taxonomy: 'hs_ideology_fiscal_conserv',
            count: 0,
            states: []
          },
          {
            id: 'hs_ideology_fiscal_conserv_opposer',
            label: 'Fiscal Conservative (Opposer)',
            description: 'Does not identify as fiscally conservative (segment ≤65)',
            category: 'Economic Issues',
            taxonomy: 'hs_ideology_fiscal_conserv',
            count: 0,
            states: []
          },
          {
            id: 'hs_medicare_for_all_support_supporter',
            label: 'Medicare for All Support (Supporter)',
            description: 'Supports Medicare for All (segment >65)',
            category: 'Economic Issues',
            taxonomy: 'hs_medicare_for_all_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_medicare_for_all_support_opposer',
            label: 'Medicare for All Support (Opposer)',
            description: 'Opposes Medicare for All (segment ≤65)',
            category: 'Economic Issues',
            taxonomy: 'hs_medicare_for_all_support',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Foreign Policy',
        description: 'Views on international relations and foreign policy',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_israel_military_actions_gop_support_supporter',
            label: 'Israel Military Actions GOP Support (Supporter)',
            description: 'Supports GOP stance on Israel military actions (segment >65)',
            category: 'Foreign Policy',
            taxonomy: 'hs_israel_military_actions_gop_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_israel_military_actions_gop_support_opposer',
            label: 'Israel Military Actions GOP Support (Opposer)',
            description: 'Opposes GOP stance on Israel military actions (segment ≤65)',
            category: 'Foreign Policy',
            taxonomy: 'hs_israel_military_actions_gop_support',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Economic Policy',
        description: 'Views on economic and fiscal policies',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_medicare_for_all_support_supporter',
            label: 'Medicare for All (Supporter)',
            description: 'Supports Medicare for All (segment >65)',
            category: 'Economic Policy',
            taxonomy: 'hs_medicare_for_all_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_medicare_for_all_support_opposer',
            label: 'Medicare for All (Opposer)',
            description: 'Opposes Medicare for All (segment ≤65)',
            category: 'Economic Policy',
            taxonomy: 'hs_medicare_for_all_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_min_wage_15_increase_support_supporter',
            label: '$15 Minimum Wage (Supporter)',
            description: 'Supports $15 minimum wage increase (segment >65)',
            category: 'Economic Policy',
            taxonomy: 'hs_min_wage_15_increase_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_min_wage_15_increase_support_opposer',
            label: '$15 Minimum Wage (Opposer)',
            description: 'Opposes $15 minimum wage increase (segment ≤65)',
            category: 'Economic Policy',
            taxonomy: 'hs_min_wage_15_increase_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_tax_cuts_support_supporter',
            label: 'Tax Cuts (Supporter)',
            description: 'Supports tax cuts (segment >65)',
            category: 'Economic Policy',
            taxonomy: 'hs_tax_cuts_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_tax_cuts_support_opposer',
            label: 'Tax Cuts (Opposer)',
            description: 'Opposes tax cuts (segment ≤65)',
            category: 'Economic Policy',
            taxonomy: 'hs_tax_cuts_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_income_inequality_serious_supporter',
            label: 'Income Inequality Serious (Supporter)',
            description: 'Views income inequality as serious (segment >65)',
            category: 'Economic Policy',
            taxonomy: 'hs_income_inequality_serious',
            count: 0,
            states: []
          },
          {
            id: 'hs_income_inequality_serious_opposer',
            label: 'Income Inequality Serious (Opposer)',
            description: 'Does not view income inequality as serious (segment ≤65)',
            category: 'Economic Policy',
            taxonomy: 'hs_income_inequality_serious',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Environment & Climate',
        description: 'Views on environmental and climate policies',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_climate_change_believer_supporter',
            label: 'Climate Change Believer (Supporter)',
            description: 'Believes in climate change (segment >65)',
            category: 'Environment',
            taxonomy: 'hs_climate_change_believer',
            count: 0,
            states: []
          },
          {
            id: 'hs_climate_change_believer_opposer',
            label: 'Climate Change Believer (Opposer)',
            description: 'Does not believe in climate change (segment ≤65)',
            category: 'Environment',
            taxonomy: 'hs_climate_change_believer',
            count: 0,
            states: []
          },
          {
            id: 'hs_green_new_deal_support_supporter',
            label: 'Green New Deal (Supporter)',
            description: 'Supports Green New Deal (segment >65)',
            category: 'Environment',
            taxonomy: 'hs_green_new_deal_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_green_new_deal_support_opposer',
            label: 'Green New Deal (Opposer)',
            description: 'Opposes Green New Deal (segment ≤65)',
            category: 'Environment',
            taxonomy: 'hs_green_new_deal_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_consumer_value_environment_supporter',
            label: 'Environmental Values (Supporter)',
            description: 'Values environmental protection (segment >65)',
            category: 'Environment',
            taxonomy: 'hs_consumer_value_environment',
            count: 0,
            states: []
          },
          {
            id: 'hs_consumer_value_environment_opposer',
            label: 'Environmental Values (Opposer)',
            description: 'Does not prioritize environmental protection (segment ≤65)',
            category: 'Environment',
            taxonomy: 'hs_consumer_value_environment',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Immigration & Border',
        description: 'Views on immigration and border policies',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_immigration_undesirable_supporter',
            label: 'Immigration Undesirable (Supporter)',
            description: 'Views immigration as undesirable (segment >65)',
            category: 'Immigration',
            taxonomy: 'hs_immigration_undesirable',
            count: 0,
            states: []
          },
          {
            id: 'hs_immigration_undesirable_opposer',
            label: 'Immigration Undesirable (Opposer)',
            description: 'Does not view immigration as undesirable (segment ≤65)',
            category: 'Immigration',
            taxonomy: 'hs_immigration_undesirable',
            count: 0,
            states: []
          },
          {
            id: 'hs_mexican_wall_support_supporter',
            label: 'Mexican Wall (Supporter)',
            description: 'Supports Mexican border wall (segment >65)',
            category: 'Immigration',
            taxonomy: 'hs_mexican_wall_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_mexican_wall_support_opposer',
            label: 'Mexican Wall (Opposer)',
            description: 'Opposes Mexican border wall (segment ≤65)',
            category: 'Immigration',
            taxonomy: 'hs_mexican_wall_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_mass_deporations_support_supporter',
            label: 'Mass Deportations (Supporter)',
            description: 'Supports mass deportations (segment >65)',
            category: 'Immigration',
            taxonomy: 'hs_mass_deporations_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_mass_deporations_support_opposer',
            label: 'Mass Deportations (Opposer)',
            description: 'Opposes mass deportations (segment ≤65)',
            category: 'Immigration',
            taxonomy: 'hs_mass_deporations_support',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Media & Trust',
        description: 'Trust in news sources and information',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_tv_most_trusted_news_fox_supporter',
            label: 'Fox News Trusted (Supporter)',
            description: 'Trusts Fox News most (segment >65)',
            category: 'Media Trust',
            taxonomy: 'hs_tv_most_trusted_news_fox',
            count: 0,
            states: []
          },
          {
            id: 'hs_tv_most_trusted_news_fox_opposer',
            label: 'Fox News Trusted (Opposer)',
            description: 'Does not trust Fox News most (segment ≤65)',
            category: 'Media Trust',
            taxonomy: 'hs_tv_most_trusted_news_fox',
            count: 0,
            states: []
          },
          {
            id: 'hs_tv_most_trusted_news_cnn_supporter',
            label: 'CNN Trusted (Supporter)',
            description: 'Trusts CNN most (segment >65)',
            category: 'Media Trust',
            taxonomy: 'hs_tv_most_trusted_news_cnn',
            count: 0,
            states: []
          },
          {
            id: 'hs_tv_most_trusted_news_cnn_opposer',
            label: 'CNN Trusted (Opposer)',
            description: 'Does not trust CNN most (segment ≤65)',
            category: 'Media Trust',
            taxonomy: 'hs_tv_most_trusted_news_cnn',
            count: 0,
            states: []
          },
          {
            id: 'hs_trust_science_always_supporter',
            label: 'Always Trusts Science (Supporter)',
            description: 'Always trusts scientific information (segment >65)',
            category: 'Media Trust',
            taxonomy: 'hs_trust_science_always',
            count: 0,
            states: []
          },
          {
            id: 'hs_trust_science_always_opposer',
            label: 'Always Trusts Science (Opposer)',
            description: 'Does not always trust scientific information (segment ≤65)',
            category: 'Media Trust',
            taxonomy: 'hs_trust_science_always',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Conspiracy Theories',
        description: 'Beliefs in conspiracy theories',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_qanon_believer_supporter',
            label: 'QAnon Believer (Supporter)',
            description: 'Believes in QAnon (segment >65)',
            category: 'Conspiracy',
            taxonomy: 'hs_qanon_believer',
            count: 0,
            states: []
          },
          {
            id: 'hs_qanon_believer_opposer',
            label: 'QAnon Believer (Opposer)',
            description: 'Does not believe in QAnon (segment ≤65)',
            category: 'Conspiracy',
            taxonomy: 'hs_qanon_believer',
            count: 0,
            states: []
          },
          {
            id: 'hs_aliens_governenment_hiding_much_supporter',
            label: 'Aliens Government Hiding (Supporter)',
            description: 'Believes government is hiding alien information (segment >65)',
            category: 'Conspiracy',
            taxonomy: 'hs_aliens_governenment_hiding_much',
            count: 0,
            states: []
          },
          {
            id: 'hs_aliens_governenment_hiding_much_opposer',
            label: 'Aliens Government Hiding (Opposer)',
            description: 'Does not believe government is hiding alien information (segment ≤65)',
            category: 'Conspiracy',
            taxonomy: 'hs_aliens_governenment_hiding_much',
            count: 0,
            states: []
          },
          {
            id: 'hs_conspiracy_believer_supporter',
            label: 'Conspiracy Believer (Supporter)',
            description: 'Believes in government conspiracies (segment >65)',
            category: 'Conspiracy',
            taxonomy: 'hs_conspiracy_believer',
            count: 0,
            states: []
          },
          {
            id: 'hs_conspiracy_believer_opposer',
            label: 'Conspiracy Believer (Opposer)',
            description: 'Does not believe in government conspiracies (segment ≤65)',
            category: 'Conspiracy',
            taxonomy: 'hs_conspiracy_believer',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },

  // 6. MIGRATION
  {
    id: 'migration',
    title: 'Migration',
    icon: '🚚',
    description: 'Migration patterns and origins',
    sections: [
      {
        title: 'Migration Origins',
        description: 'States where voters moved from (123 records)',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'voters_movedfrom_state_ca',
            label: 'Moved from California',
            description: 'Voters who moved from California',
            category: 'Migration',
            taxonomy: 'voters_movedfrom_state',
            count: 0,
            states: []
          },
          {
            id: 'voters_movedfrom_state_ny',
            label: 'Moved from New York',
            description: 'Voters who moved from New York',
            category: 'Migration',
            taxonomy: 'voters_movedfrom_state',
            count: 0,
            states: []
          },
          {
            id: 'voters_movedfrom_state_tx',
            label: 'Moved from Texas',
            description: 'Voters who moved from Texas',
            category: 'Migration',
            taxonomy: 'voters_movedfrom_state',
            count: 0,
            states: []
          },
          {
            id: 'voters_movedfrom_state_fl',
            label: 'Moved from Florida',
            description: 'Voters who moved from Florida',
            category: 'Migration',
            taxonomy: 'voters_movedfrom_state',
            count: 0,
            states: []
          }
        ]
      }
    ]
  }
];

/**
 * Get the finalized filter catalog
 */
export function getFinalizedFilterCatalog(): FilterCategory[] {
  return FINALIZED_FILTER_CATALOG;
}

/**
 * Get filter by taxonomy from the finalized catalog
 */
export function getFinalizedFilterByTaxonomy(taxonomy: string): FilterItem | null {
  for (const category of FINALIZED_FILTER_CATALOG) {
    for (const section of category.sections) {
      const item = section.items.find(item => item.taxonomy === taxonomy);
      if (item) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Get all taxonomies from the finalized catalog
 */
export function getAllFinalizedTaxonomies(): string[] {
  const taxonomies: Set<string> = new Set();
  for (const category of FINALIZED_FILTER_CATALOG) {
    for (const section of category.sections) {
      for (const item of section.items) {
        taxonomies.add(item.taxonomy);
      }
    }
  }
  return Array.from(taxonomies);
}
