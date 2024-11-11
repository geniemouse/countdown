/**
 * Insert data values via replacement of key names referenced in a
 * template string.
 *
 * @todo:
 * -- Add delimiter options???
 * -- How to handle value that is an array?
 * -- How to handle deeper data structures?
 * 	  -- Transform template string ("...") into string literal (`...`) ?
 *
 * @param   {String}  template  -- String pattern with references to property/
 * 								   key names to be replaced
 * @param   {Object}  data      -- Key/value pairs of template items to replace
 *
 * @return  {String}            -- Resolved template string
 */
export function interpolate(template = "", data = {}) {
	return Object.entries(data).reduce((result, [key, value]) => {
		return result.replace(`$\{${key}\}`, `${value}`);
	}, template);
}
