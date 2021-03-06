defmodule Langue.Formatter.Gettext.Serializer do
  @behaviour Langue.Formatter.Serializer

  alias Langue.Utils.NestedParserHelper

  def serialize(%{entries: entries, top_of_the_file_comment: top_of_the_file_comment, header: header, locale: locale}) do
    comments =
      top_of_the_file_comment
      |> String.trim()
      |> split_string()
      |> Enum.filter(fn item -> item != "" end)

    headers =
      header
      |> String.trim()
      |> String.replace("\"", "")
      |> replace_language_header(locale)
      |> split_string()
      |> Enum.filter(fn item -> item != "" end)

    render =
      %Gettext.PO{
        translations: parse_entries(entries, 0),
        top_of_the_file_comments: comments,
        headers: headers
      }
      |> Gettext.PO.dump()
      |> IO.iodata_to_binary()

    %Langue.Formatter.SerializerResult{render: render}
  end

  defp parse_entries(entries, index) do
    entries
    |> NestedParserHelper.group_by_key_with_index(index, "__KEY__")
    |> Enum.map(&do_parse_entries/1)
  end

  defp do_parse_entries({_key, [entry]}) do
    %Gettext.PO.Translation{
      comments: split_string(entry.comment),
      msgid: split_string(entry.key),
      msgstr: split_string(entry.value)
    }
  end

  defp do_parse_entries({_key, [plural_entry | entries]}) do
    msgid =
      plural_entry.key
      |> remove_key_suffix()
      |> split_string()

    %Gettext.PO.PluralTranslation{
      comments: split_string(plural_entry.comment),
      msgid: msgid,
      msgid_plural: split_string(plural_entry.value),
      msgstr:
        Enum.reduce(Enum.with_index(entries, 0), %{}, fn {entry, index}, acc ->
          value = split_string(entry.value)

          Map.put(acc, index, value)
        end)
    }
  end

  defp split_string(""), do: []
  defp split_string(nil), do: []
  defp split_string(string), do: String.split(string, "\n")

  defp remove_key_suffix(string), do: String.replace(string, ".__KEY___", "")

  defp replace_language_header(string, locale), do: String.replace(string, ~r/Language: [a-zA-Z]+/, "Language: #{locale}")
end
