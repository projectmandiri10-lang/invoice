CREATE OR REPLACE FUNCTION get_client_portal_data(p_access_token UUID)
RETURNS TABLE (
    client_name TEXT,
    documents JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.client_name,
        (
            SELECT jsonb_agg(d.*)
            FROM documents d
            WHERE d.client_id = c.id AND d.document_type = 'invoice'
        ) AS documents
    FROM
        clients c
    WHERE
        c.portal_access_token = p_access_token;
END;
$$ LANGUAGE plpgsql;
