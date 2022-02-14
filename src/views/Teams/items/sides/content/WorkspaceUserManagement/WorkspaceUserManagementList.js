import Avatar from 'components/Avatar/Avatar';
import Badge from 'components/Badge/Badge';
import * as Styled from 'views/Teams/Teams.styles';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import { decodeBase64 } from 'helpers/helpers';

function WorkspaceUserManagementExtraTeamsList({ Applications }) {
  return (
    <>
      <PopupMenu
        trigger="hover"
        align="top"
        arrowClass="hidden-arrow"
        menuClass="">
        <div>
          <Badge
            showText={`${Applications.length - 4}+`}
            className="extraTeamsIndicator"
          />
        </div>

        <div className="extraTeamsPanel">
          <ScrollBarProvider>
            {Applications.map(({ ApplicationID, Title, IconURL }, idx) => {
              if (idx > 4)
                return (
                  <Styled.ExtraUserItem key={ApplicationID}>
                    <Avatar userImage={IconURL} radius={25} />
                    <Styled.ExtraUserTitle>
                      {decodeBase64(Title)}
                    </Styled.ExtraUserTitle>
                  </Styled.ExtraUserItem>
                );
            })}
          </ScrollBarProvider>
        </div>
      </PopupMenu>
    </>
  );
}

export default WorkspaceUserManagementExtraTeamsList;
