let
  sources = import ./nix/sources.nix {};
  mkProject = import ../default.nix;
in
{
  network = {
    description = "Union Gov deployment";
    storage.legacy = {};
  };

  uniongov = { pkgs, config, lib, ... }: let
    project = mkProject { inherit pkgs; };
    raitoNUR = (import sources.raito-nur { inherit pkgs; });
    domain = "gouv.charlotte-marchandise.fr";
    extraDomains = [ "uniongov.v6.lahfa.xyz" "uniongov.lahfa.xyz" ];
    protocol = if config.services.nginx.virtualHosts.${domain}.forceSSL then "https" else "http";
    fullLocation = "${protocol}://${domain}";
    fullLocations = [ fullLocation ] ++ map (d: "${protocol}://${d}") extraDomains;
  in {
    # Set up RaitoBezarius' NUR
    imports = [
      ./proxmox.nix
      "${sources.agenix}/modules/age.nix"
      raitoNUR.modules.django
      raitoNUR.modules.nextjs
    ];

    environment.systemPackages = [ pkgs.kitty.terminfo ];

    services.openssh.enable = true;
    services.qemuGuest.enable = true;
    networking.firewall.allowedTCPPorts = [ 22 80 443 ];
    users.users.root.openssh.authorizedKeys.keyFiles = [ ./root.keys ];

    deployment.proxmox.vmid = 600;
    age.secrets.backendEnv.file = ./secrets/backendEnv.age;

    #deployment.targetHost = "uniongov.v6.lahfa.xyz";

    security.acme.email = "ryan@lahfa.xyz";
    security.acme.acceptTerms = true;

    services.nextjs.uniongov = {
      enable = true;
      src = ../frontend;
      nextDir = null;
      inherit (project.frontend) nodeModules;
      port = 3000;
      environment = {
        NEXT_PUBLIC_API_HOST = fullLocation;
        NEXT_PUBLIC_FRONTEND_BASE_URL = fullLocation;
      };
    };

    services.django.uniongov = {
      enable = true;
      inherit (project.backend) package;
      wsgiEntryPoint = "unionGov.wsgi:application";
      settingsModule = "unionGov.settings";
      port = 8000;
      environment = {
        FRONTEND_URL = fullLocation;
        DATABASE_URL = "sqlite:///var/lib/uniongov/db.sqlite";
        MEDIA_ROOT = "/var/lib/uniongov/uploads";
        ALLOWED_HOSTS = "127.0.0.1,localhost,${domain},${lib.concatStringsSep "," extraDomains}";
        CSRF_TRUSTED_ORIGINS = lib.concatStringsSep "," fullLocations;
      };
      environmentFile = config.age.secrets.backendEnv.path;
      # preStartAdminCommands = [ "migrate" ];
    };

    systemd.services."django-uniongov".serviceConfig.StateDirectory = "uniongov";

    services.nginx = {
      enable = true;
      virtualHosts."${domain}" = {
        enableACME = true;
        forceSSL = true;
        serverAliases = extraDomains;
        locations."/" = {
          proxyPass = "http://localhost:3000";
        };
        locations."/img/" = {
          alias = "/var/lib/uniongov/uploads/img/";
        };
        locations."/static/" = {
          alias = "${project.backend.static}/";
        };
        locations."/admin" = {
          proxyPass = "http://localhost:8000";
        };
        locations."/api/" = {
          proxyPass = "http://localhost:8000/"; # Leading slash is necessary to strip /api
        };
      };
    };
  };
}
