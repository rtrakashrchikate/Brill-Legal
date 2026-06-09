<?php
/**
 * Plugin Name: Brill Legal — Headless Backend
 * Description: Registers all custom post types, taxonomies, ACF field groups,
 *              the Site Settings options page, the enquiry capture mutation,
 *              GraphQL CORS and CMS noindex for the headless Next.js front-end.
 * Version:     1.0.0
 *
 * Drop this file in wp-content/mu-plugins/ (create the folder if needed).
 * Required plugins: WPGraphQL, Advanced Custom Fields PRO, WPGraphQL for ACF.
 *
 * GraphQL/field names match the Next.js queries in src/lib/wp/. The front-end
 * practice route slugs are: dispute-resolution, white-collar, real-estate,
 * private-client, arbitration, corporate, tribunal — set the `vertical`
 * taxonomy term slugs to these so URLs stay stable.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* -------------------------------------------------------------------------
 * 1. TAXONOMIES
 * ---------------------------------------------------------------------- */
add_action('init', function () {
    register_taxonomy('vertical', ['post', 'practice', 'location'], [
        'labels'             => ['name' => 'Verticals', 'singular_name' => 'Vertical'],
        'public'             => true,
        'hierarchical'       => true,
        'show_in_graphql'    => true,
        'graphql_single_name' => 'vertical',
        'graphql_plural_name' => 'verticals',
    ]);

    register_taxonomy('city', ['location', 'person'], [
        'labels'             => ['name' => 'Cities', 'singular_name' => 'City'],
        'public'             => true,
        'hierarchical'       => false,
        'show_in_graphql'    => true,
        'graphql_single_name' => 'city',
        'graphql_plural_name' => 'cities',
    ]);

    register_taxonomy('glossary_letter', ['glossary'], [
        'labels'             => ['name' => 'Glossary Letters', 'singular_name' => 'Glossary Letter'],
        'public'             => true,
        'hierarchical'       => false,
        'show_in_graphql'    => true,
        'graphql_single_name' => 'glossaryLetter',
        'graphql_plural_name' => 'glossaryLetters',
    ]);
}, 5);

/* -------------------------------------------------------------------------
 * 2. POST TYPES
 * ---------------------------------------------------------------------- */
add_action('init', function () {
    $cpt = function ($slug, $single, $plural, $args = []) {
        register_post_type($slug, array_merge([
            'labels'              => ['name' => $plural, 'singular_name' => $single],
            'public'              => true,
            'has_archive'         => false,
            'show_in_rest'        => true,
            'show_in_graphql'     => true,
            'graphql_single_name' => null, // set per call
            'graphql_plural_name' => null,
            'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'author'],
        ], $args));
    };

    $cpt('practice', 'Practice', 'Practices', [
        'graphql_single_name' => 'practice', 'graphql_plural_name' => 'practices',
        'menu_icon' => 'dashicons-portfolio',
    ]);
    $cpt('sector', 'Sector', 'Sectors', [
        'graphql_single_name' => 'sector', 'graphql_plural_name' => 'sectors',
    ]);
    $cpt('person', 'Person', 'People', [
        'graphql_single_name' => 'person', 'graphql_plural_name' => 'people',
        'supports' => ['title', 'thumbnail'],
    ]);
    $cpt('location', 'Location', 'Locations', [
        'graphql_single_name' => 'location', 'graphql_plural_name' => 'locations',
        'supports' => ['title', 'editor'],
    ]);
    $cpt('glossary', 'Glossary Term', 'Glossary Terms', [
        'graphql_single_name' => 'glossaryTerm', 'graphql_plural_name' => 'glossaryTerms',
        'supports' => ['title', 'editor'],
    ]);
    $cpt('resource', 'Resource', 'Resources', [
        'graphql_single_name' => 'resource', 'graphql_plural_name' => 'resources',
    ]);
    $cpt('news', 'News Item', 'News Items', [
        'graphql_single_name' => 'newsItem', 'graphql_plural_name' => 'newsItems',
    ]);
    $cpt('linkedin_feature', 'LinkedIn Feature', 'LinkedIn Features', [
        'graphql_single_name' => 'linkedinFeature', 'graphql_plural_name' => 'linkedinFeatures',
        'supports' => ['title'],
    ]);

    // Enquiry: private inbox. Exposed to GraphQL so the custom create mutation
    // can run, but NOT public and not readable without auth.
    register_post_type('enquiry', [
        'labels'              => ['name' => 'Enquiries', 'singular_name' => 'Enquiry'],
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'menu_icon'           => 'dashicons-email',
        'show_in_graphql'     => true,
        'graphql_single_name' => 'enquiry',
        'graphql_plural_name' => 'enquiries',
        'supports'            => ['title'],
    ]);
}, 5);

/* -------------------------------------------------------------------------
 * 3. ACF FIELD GROUPS (registered in code = version-controlled)
 *    Requires ACF Pro + WPGraphQL for ACF.
 * ---------------------------------------------------------------------- */
add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    $gql = function ($name) {
        return ['show_in_graphql' => 1, 'graphql_field_name' => $name];
    };

    // 3.1 Article (Posts) — articleFields
    acf_add_local_field_group([
        'key'      => 'group_articleFields',
        'title'    => 'Article Fields',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'post']]],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'articleFields',
        'fields'   => [
            ['key' => 'field_art_seoTitle', 'name' => 'seoTitle', 'label' => 'SEO Title', 'type' => 'text'],
            ['key' => 'field_art_metaDescription', 'name' => 'metaDescription', 'label' => 'Meta Description', 'type' => 'textarea', 'rows' => 2],
            ['key' => 'field_art_readTime', 'name' => 'readTime', 'label' => 'Read Time (min)', 'type' => 'number'],
            ['key' => 'field_art_isPillar', 'name' => 'isPillar', 'label' => 'Cornerstone / Pillar?', 'type' => 'true_false', 'ui' => 1],
            ['key' => 'field_art_relatedPractice', 'name' => 'relatedPractice', 'label' => 'Related Practice', 'type' => 'relationship', 'post_type' => ['practice'], 'max' => 1],
            ['key' => 'field_art_relatedArticles', 'name' => 'relatedArticles', 'label' => 'Related Articles', 'type' => 'relationship', 'post_type' => ['post'], 'max' => 3],
            ['key' => 'field_art_faq', 'name' => 'faq', 'label' => 'FAQ', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_art_faq_q', 'name' => 'question', 'label' => 'Question', 'type' => 'text'],
                ['key' => 'field_art_faq_a', 'name' => 'answer', 'label' => 'Answer', 'type' => 'textarea', 'rows' => 3],
            ]],
        ],
    ]);

    // 3.2 Practice — practiceFields
    acf_add_local_field_group([
        'key'      => 'group_practiceFields',
        'title'    => 'Practice Fields',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'practice']]],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'practiceFields',
        'fields'   => [
            ['key' => 'field_prac_heroIntro', 'name' => 'heroIntro', 'label' => 'Hero Intro', 'type' => 'textarea', 'rows' => 2],
            ['key' => 'field_prac_overview', 'name' => 'overview', 'label' => 'Overview', 'type' => 'wysiwyg'],
            ['key' => 'field_prac_summary', 'name' => 'summary', 'label' => 'Card Summary', 'type' => 'textarea', 'rows' => 2],
            ['key' => 'field_prac_matterType', 'name' => 'matterType', 'label' => 'Contact Matter Type', 'type' => 'text'],
            ['key' => 'field_prac_capabilities', 'name' => 'capabilities', 'label' => 'Capabilities', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_prac_cap_item', 'name' => 'item', 'label' => 'Item', 'type' => 'text'],
            ]],
            ['key' => 'field_prac_orderNo', 'name' => 'orderNo', 'label' => 'Order (01–07)', 'type' => 'number'],
            ['key' => 'field_prac_seoTitle', 'name' => 'seoTitle', 'label' => 'SEO Title', 'type' => 'text'],
            ['key' => 'field_prac_metaDescription', 'name' => 'metaDescription', 'label' => 'Meta Description', 'type' => 'textarea', 'rows' => 2],
        ],
    ]);

    // 3.3 Person — personFields
    acf_add_local_field_group([
        'key'      => 'group_personFields',
        'title'    => 'Person Fields',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'person']]],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'personFields',
        'fields'   => [
            ['key' => 'field_per_roleTitle', 'name' => 'roleTitle', 'label' => 'Role Title', 'type' => 'text'],
            ['key' => 'field_per_bio', 'name' => 'bio', 'label' => 'Bio', 'type' => 'textarea', 'rows' => 3],
            ['key' => 'field_per_practiceFocus', 'name' => 'practiceFocus', 'label' => 'Practice Focus', 'type' => 'textarea', 'rows' => 2],
            ['key' => 'field_per_enrolment', 'name' => 'enrolment', 'label' => 'Enrolment', 'type' => 'text'],
            ['key' => 'field_per_displayOrder', 'name' => 'displayOrder', 'label' => 'Display Order', 'type' => 'number'],
            ['key' => 'field_per_linkedinUrl', 'name' => 'linkedinUrl', 'label' => 'LinkedIn URL', 'type' => 'url'],
        ],
    ]);

    // 3.4 Location — locationFields (localIntro MUST be unique per city)
    acf_add_local_field_group([
        'key'      => 'group_locationFields',
        'title'    => 'Location Fields',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'location']]],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'locationFields',
        'fields'   => [
            ['key' => 'field_loc_serviceLabel', 'name' => 'serviceLabel', 'label' => 'Service Label', 'type' => 'text'],
            ['key' => 'field_loc_cityLabel', 'name' => 'cityLabel', 'label' => 'City Label', 'type' => 'text'],
            ['key' => 'field_loc_localIntro', 'name' => 'localIntro', 'label' => 'Local Intro (UNIQUE per page)', 'type' => 'wysiwyg'],
            ['key' => 'field_loc_localCourts', 'name' => 'localCourts', 'label' => 'Local Courts', 'type' => 'textarea', 'rows' => 3],
            ['key' => 'field_loc_relatedPractice', 'name' => 'relatedPractice', 'label' => 'Related Practice', 'type' => 'relationship', 'post_type' => ['practice'], 'max' => 1],
            ['key' => 'field_loc_relatedArticles', 'name' => 'relatedArticles', 'label' => 'Related Articles', 'type' => 'relationship', 'post_type' => ['post'], 'max' => 3],
            ['key' => 'field_loc_faq', 'name' => 'faq', 'label' => 'FAQ', 'type' => 'repeater', 'sub_fields' => [
                ['key' => 'field_loc_faq_q', 'name' => 'question', 'label' => 'Question', 'type' => 'text'],
                ['key' => 'field_loc_faq_a', 'name' => 'answer', 'label' => 'Answer', 'type' => 'textarea', 'rows' => 3],
            ]],
            ['key' => 'field_loc_seoTitle', 'name' => 'seoTitle', 'label' => 'SEO Title', 'type' => 'text'],
            ['key' => 'field_loc_metaDescription', 'name' => 'metaDescription', 'label' => 'Meta Description', 'type' => 'textarea', 'rows' => 2],
        ],
    ]);

    // 3.5 Glossary — glossaryFields
    acf_add_local_field_group([
        'key'      => 'group_glossaryFields',
        'title'    => 'Glossary Fields',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'glossary']]],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'glossaryFields',
        'fields'   => [
            ['key' => 'field_glo_definition', 'name' => 'definition', 'label' => 'Definition', 'type' => 'textarea', 'rows' => 3],
            ['key' => 'field_glo_relatedPractice', 'name' => 'relatedPractice', 'label' => 'Related Practice', 'type' => 'relationship', 'post_type' => ['practice'], 'max' => 1],
            ['key' => 'field_glo_relatedArticle', 'name' => 'relatedArticle', 'label' => 'Related Article', 'type' => 'relationship', 'post_type' => ['post'], 'max' => 1],
        ],
    ]);

    // 3.6 Resource — resourceFields
    acf_add_local_field_group([
        'key'      => 'group_resourceFields',
        'title'    => 'Resource Fields',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'resource']]],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'resourceFields',
        'fields'   => [
            ['key' => 'field_res_summary', 'name' => 'summary', 'label' => 'Summary', 'type' => 'textarea', 'rows' => 2],
            ['key' => 'field_res_file', 'name' => 'file', 'label' => 'File', 'type' => 'file', 'return_format' => 'url'],
            ['key' => 'field_res_gateEmail', 'name' => 'gateEmail', 'label' => 'Require email?', 'type' => 'true_false', 'ui' => 1],
            ['key' => 'field_res_relatedPractice', 'name' => 'relatedPractice', 'label' => 'Related Practice', 'type' => 'relationship', 'post_type' => ['practice'], 'max' => 1],
            ['key' => 'field_res_seoTitle', 'name' => 'seoTitle', 'label' => 'SEO Title', 'type' => 'text'],
            ['key' => 'field_res_metaDescription', 'name' => 'metaDescription', 'label' => 'Meta Description', 'type' => 'textarea', 'rows' => 2],
        ],
    ]);

    // 3.7 News — newsFields
    acf_add_local_field_group([
        'key'      => 'group_newsFields',
        'title'    => 'News Fields',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'news']]],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'newsFields',
        'fields'   => [
            ['key' => 'field_news_summary', 'name' => 'summary', 'label' => 'Summary', 'type' => 'textarea', 'rows' => 2],
            ['key' => 'field_news_date', 'name' => 'date', 'label' => 'Date', 'type' => 'date_picker', 'return_format' => 'Y-m-d'],
            ['key' => 'field_news_category', 'name' => 'category', 'label' => 'Category', 'type' => 'select', 'choices' => ['Firm update' => 'Firm update', 'Legal update' => 'Legal update']],
        ],
    ]);

    // 3.8 Enquiry — enquiryFields (written by the front-end mutation)
    acf_add_local_field_group([
        'key'      => 'group_enquiryFields',
        'title'    => 'Enquiry Fields',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'enquiry']]],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'enquiryFields',
        'fields'   => [
            ['key' => 'field_enq_fullName', 'name' => 'fullName', 'label' => 'Full Name', 'type' => 'text'],
            ['key' => 'field_enq_phone', 'name' => 'phone', 'label' => 'Phone', 'type' => 'text'],
            ['key' => 'field_enq_email', 'name' => 'email', 'label' => 'Email', 'type' => 'email'],
            ['key' => 'field_enq_matterType', 'name' => 'matterType', 'label' => 'Matter Type', 'type' => 'text'],
            ['key' => 'field_enq_message', 'name' => 'message', 'label' => 'Message', 'type' => 'textarea', 'rows' => 4],
            ['key' => 'field_enq_sourcePage', 'name' => 'sourcePage', 'label' => 'Source Page', 'type' => 'text'],
            ['key' => 'field_enq_submittedAt', 'name' => 'submittedAt', 'label' => 'Submitted At', 'type' => 'text'],
        ],
    ]);

    // 3.9 Site Settings — ACF options page (siteSettings)
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title'      => 'Site Settings',
            'menu_title'      => 'Site Settings',
            'menu_slug'       => 'site-settings',
            'capability'      => 'edit_posts',
            'show_in_graphql' => true,
            'graphql_field_name' => 'siteSettings',
        ]);

        acf_add_local_field_group([
            'key'      => 'group_siteSettings',
            'title'    => 'Site Settings Fields',
            'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'site-settings']]],
            'show_in_graphql' => 1,
            'graphql_field_name' => 'siteSettingsFields',
            'fields'   => [
                ['key' => 'field_set_firmName', 'name' => 'firmName', 'label' => 'Firm Name', 'type' => 'text', 'default_value' => 'Brill Legal'],
                ['key' => 'field_set_strapline', 'name' => 'strapline', 'label' => 'Strapline', 'type' => 'text', 'default_value' => 'Practising since 2007'],
                ['key' => 'field_set_phone', 'name' => 'phone', 'label' => 'Phone', 'type' => 'text'],
                ['key' => 'field_set_whatsappNumber', 'name' => 'whatsappNumber', 'label' => 'WhatsApp Number', 'type' => 'text'],
                ['key' => 'field_set_email', 'name' => 'email', 'label' => 'Email', 'type' => 'email'],
                ['key' => 'field_set_officeAddress', 'name' => 'officeAddress', 'label' => 'Office Address', 'type' => 'textarea', 'rows' => 3],
                ['key' => 'field_set_gbpUrl', 'name' => 'gbpUrl', 'label' => 'Google Business Profile URL', 'type' => 'url'],
                ['key' => 'field_set_linkedinUrl', 'name' => 'linkedinUrl', 'label' => 'LinkedIn URL', 'type' => 'url'],
                ['key' => 'field_set_footerDisclaimer', 'name' => 'footerDisclaimer', 'label' => 'Footer Disclaimer', 'type' => 'textarea', 'rows' => 3],
                ['key' => 'field_set_officeHours', 'name' => 'officeHours', 'label' => 'Office Hours', 'type' => 'text'],
            ],
        ]);
    }
});

/* -------------------------------------------------------------------------
 * 4. CUSTOM GraphQL MUTATION — createEnquiry
 *    Flat input; writes the CPT + ACF meta server-side. Requires an
 *    authenticated request (application password) with publish capability.
 * ---------------------------------------------------------------------- */
add_action('graphql_register_types', function () {
    register_graphql_input_type('CreateEnquiryInput', [
        'fields' => [
            'fullName'   => ['type' => ['non_null' => 'String']],
            'phone'      => ['type' => ['non_null' => 'String']],
            'email'      => ['type' => 'String'],
            'matterType' => ['type' => 'String'],
            'message'    => ['type' => 'String'],
            'sourcePage' => ['type' => 'String'],
            'submittedAt'=> ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('CreateEnquiryPayload', [
        'fields' => [
            'success'    => ['type' => 'Boolean'],
            'databaseId' => ['type' => 'Int'],
        ],
    ]);

    register_graphql_mutation('createEnquiry', [
        'inputFields'  => ['input' => ['type' => ['non_null' => 'CreateEnquiryInput']]],
        'outputFields' => [
            'success'    => ['type' => 'Boolean'],
            'databaseId' => ['type' => 'Int'],
        ],
        'mutateAndGetPayload' => function ($payload) {
            $in = $payload['input'] ?? $payload;

            // Only authenticated editors may create enquiries.
            if (!current_user_can('publish_posts')) {
                throw new \GraphQL\Error\UserError('Not authorized.');
            }

            $name = sanitize_text_field($in['fullName'] ?? '');
            $matter = sanitize_text_field($in['matterType'] ?? 'General');
            $date = substr(sanitize_text_field($in['submittedAt'] ?? ''), 0, 10);

            $post_id = wp_insert_post([
                'post_type'   => 'enquiry',
                'post_status' => 'draft',
                'post_title'  => trim("$name — $matter ($date)"),
            ], true);

            if (is_wp_error($post_id)) {
                return ['success' => false, 'databaseId' => 0];
            }

            $fields = [
                'fullName'    => sanitize_text_field($in['fullName'] ?? ''),
                'phone'       => sanitize_text_field($in['phone'] ?? ''),
                'email'       => sanitize_email($in['email'] ?? ''),
                'matterType'  => sanitize_text_field($in['matterType'] ?? ''),
                'message'     => sanitize_textarea_field($in['message'] ?? ''),
                'sourcePage'  => sanitize_text_field($in['sourcePage'] ?? ''),
                'submittedAt' => sanitize_text_field($in['submittedAt'] ?? ''),
            ];
            foreach ($fields as $key => $val) {
                if (function_exists('update_field')) {
                    update_field($key, $val, $post_id);
                } else {
                    update_post_meta($post_id, $key, $val);
                }
            }

            return ['success' => true, 'databaseId' => $post_id];
        },
    ]);
});

/* -------------------------------------------------------------------------
 * 5. CORS for the GraphQL endpoint (allow the front-end origin)
 * ---------------------------------------------------------------------- */
add_filter('graphql_response_headers_to_send', function ($headers) {
    $allowed = [
        'https://brilllegal.in',
        'https://www.brilllegal.in',
        'http://localhost:3000',
    ];
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if (in_array($origin, $allowed, true)) {
        $headers['Access-Control-Allow-Origin'] = $origin;
        $headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
        $headers['Access-Control-Allow-Credentials'] = 'true';
    }
    return $headers;
});

/* -------------------------------------------------------------------------
 * 6. Keep the CMS subdomain out of the index (front-end is canonical)
 * ---------------------------------------------------------------------- */
add_action('pre_get_posts', function () {
    // Belt-and-braces: also set Settings → Reading → Discourage search engines.
}, 1);
add_filter('wp_robots', function ($robots) {
    $robots['noindex'] = true;
    $robots['nofollow'] = true;
    return $robots;
});
